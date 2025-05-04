import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFileState } from '@/contexts/ModuleContext';
import { useSummaryModule } from '@/contexts/ModuleContext';
import { createFormData } from '@/services/webhookUtils';
import { PDF_WEBHOOKS } from '@/services/module/webhookUrls';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const POLL_INTERVAL_MS = 3000;  // 3 seconds
const POLL_TIMEOUT_MS = 45000; // 45 seconds max wait

export const useCustomUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { setCurrentFile } = useFileState();
  const { setSummaryData } = useSummaryModule();
  const { user } = useAuth();

  const [isPollingSummary, setIsPollingSummary] = useState(false);

  let pollingTimer: NodeJS.Timeout | null = null;

  const handleSubmit = async (file: File | null) => {
    if (!file) {
      toast("No file selected", {
        description: 'Please upload a file first'
      });
      return;
    }

    try {
      setIsProcessing(true);
      setIsPollingSummary(false);
      console.log("Starting upload process for file:", file.name);
      setCurrentFile(file);

      const formData = createFormData(file);

      const webhookUrls = PDF_WEBHOOKS;
      if (webhookUrls.length === 0) {
        console.warn("No webhook URLs configured");
        throw new Error("Webhook URLs are not configured");
      }

      console.log("Sending file to webhooks:", webhookUrls);

      const promises = webhookUrls.map(url => 
        fetch(url, {
          method: 'POST',
          body: formData,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        })
        .then(async response => {
          if (!response.ok) {
            const responseText = await response.text();
            console.error(`Webhook at ${url} error response:`, responseText);
            return { url, success: false, error: responseText };
          }
          const responseText = await response.text();
          console.log(`Webhook at ${url} response:`, responseText);
          return { url, success: true, response: responseText };
        })
        .catch(error => {
          console.error(`Error calling webhook at ${url}:`, error);
          return { url, success: false, error: error.message };
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.success).length;

      if (successCount === 0) {
        throw new Error("All webhook calls failed");
      }

      setIsPollingSummary(true);
      const summary = await pollForSummary(user?.id, file.name, (foundSummary) => {
        setSummaryData({
          processed: foundSummary,
          original: null
        });
      });
      setIsPollingSummary(false);

      if (summary) {
        setSummaryData({
          processed: summary,
          original: null
        });
        toast.success("File uploaded successfully", {
          description: `Summary received from backend.`
        });
      } else {
        setSummaryData({
          processed: "Your file was sent to webhooks, but no summary was returned in time.",
          original: null
        });
        toast.error("No summary found", {
          description: "No summary data was found in backend after waiting. Try again later."
        });
      }

      navigate('/results', { replace: true });
    } catch (error) {
      setIsPollingSummary(false);
      console.error("Error during upload processing:", error);
      toast.error("Error processing file", {
        description: error instanceof Error ? error.message : "There was a problem processing your file"
      });
      throw error;
    } finally {
      setIsProcessing(false);
      if (pollingTimer) clearInterval(pollingTimer);
    }
  };

  const pollForSummary = async (
    userId: string | undefined, 
    fileName: string, 
    onSummary?: (summary: string) => void
  ): Promise<string | null> => {
    if (!userId) {
      console.warn("No user ID, skipping polling for summary");
      return null;
    }
    console.log("[Polling] Starting for user:", userId, "file:", fileName);

    const start = Date.now();
    let prevSummary: string | null = null;

    return new Promise<string | null>((resolve) => {
      pollingTimer = setInterval(async () => {
        const elapsedMs = Date.now() - start;
        if (elapsedMs > POLL_TIMEOUT_MS) {
          clearInterval(pollingTimer as NodeJS.Timeout);
          resolve(null);
          return;
        }
        try {
          const { data, error } = await supabase
            .from('PDF Summary')
            .select('Summary')
            .eq('User_ID', userId)
            .eq('File Name', fileName);

          if (error) {
            console.error("[Polling] Supabase error:", error);
          }
          if (data && data.length > 0 && data[0].Summary) {
            const summary = data[0].Summary as string;
            if (summary && summary !== prevSummary) {
              prevSummary = summary;
              console.log("[Polling] Summary found, updating immediately.");
              if (onSummary) onSummary(summary);
              clearInterval(pollingTimer as NodeJS.Timeout);
              resolve(summary);
            } else {
              console.log("[Polling] No new summary yet for", fileName);
            }
          } else {
            console.log("[Polling] No summary yet for", fileName);
          }
        } catch (err) {
          console.error("[Polling] Caught error:", err);
        }
      }, POLL_INTERVAL_MS);
    });
  };

  const readFileAsText = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return {
    isProcessing: isProcessing || isPollingSummary,
    handleSubmit,
    isPollingSummary,
  };
};
