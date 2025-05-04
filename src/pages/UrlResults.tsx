
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { useFileState, useSummaryModule } from '@/contexts/ModuleContext';
import SummaryPanel from './results/SummaryPanel';
import TabContent from './results/TabContent';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const POLL_INTERVAL_MS = 3000;  // 3 seconds
const POLL_TIMEOUT_MS = 60000; // 60 seconds max wait

const UrlResults = () => {
  const { currentFile } = useFileState();
  const { processedText, originalText, setSummaryData } = useSummaryModule();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isContentReady, setIsContentReady] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  
  useEffect(() => {
    console.log("🔗 URL Results page mounted, currentFile:", currentFile ? currentFile.name : "none");
    
    const checkFile = setTimeout(() => {
      if (!currentFile && !location.state?.file) {
        console.log("No URL file found in context, redirecting to upload");
        toast("No URL found", {
          description: "Please provide a valid URL first"
        });
        navigate('/upload');
      } else {
        setIsContentReady(true);
        
        // Start polling for URL summary if we have a file
        if (currentFile && user?.id) {
          startPollingForUrlSummary();
        }
      }
    }, 500);
    
    return () => {
      clearTimeout(checkFile);
      stopPolling();
    };
  }, [currentFile, navigate, location.state, user?.id]);

  // Polling logic
  let pollingTimer: NodeJS.Timeout | null = null;

  const startPollingForUrlSummary = async () => {
    if (!currentFile || !user?.id) return;
    
    const fileName = currentFile.name;
    const userId = user.id;
    
    console.log("[URL Polling] Starting polling for summary, file:", fileName, "user:", userId);
    setIsPolling(true);
    
    const start = Date.now();
    let prevSummary: string | null = null;
    
    pollingTimer = setInterval(async () => {
      const elapsedMs = Date.now() - start;
      if (elapsedMs > POLL_TIMEOUT_MS) {
        console.log("[URL Polling] Timeout reached after", POLL_TIMEOUT_MS, "ms");
        stopPolling();
        return;
      }
      
      try {
        console.log("[URL Polling] Checking URL Summary table...");
        const { data, error } = await supabase
          .from('URL Summary')
          .select('Summary')
          .eq('User_ID', userId)
          .eq('File Name', fileName);
        
        if (error) {
          console.error("[URL Polling] Supabase error:", error);
        }
        
        if (data && data.length > 0 && data[0].Summary) {
          const summary = data[0].Summary as string;
          if (summary && summary !== prevSummary) {
            prevSummary = summary;
            console.log("[URL Polling] Summary found:", summary.substring(0, 50) + "...");
            
            // Update the summary in the context
            setSummaryData({
              processed: summary,
              original: originalText || null
            });
            
            toast.success("URL Processing Complete", {
              description: "Summary data has arrived from the backend."
            });
            
            // Stop polling as we found the data
            stopPolling();
          }
        } else {
          console.log("[URL Polling] No summary yet for", fileName);
        }
      } catch (err) {
        console.error("[URL Polling] Error checking for summary:", err);
      }
    }, POLL_INTERVAL_MS);
  };
  
  const stopPolling = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
      setIsPolling(false);
    }
  };

  const fileTitle = currentFile ? currentFile.name.replace(/\.\w+$/, '') : "Your URL Document";

  if (!currentFile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow gradient-bg pt-20 flex items-center justify-center">
          <div className="apple-card p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-spin" />
            <p className="text-xl font-medium">Checking URL document...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="gradient-bg pt-4">
          <div className="section-container pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="apple-card shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
                <SummaryPanel fileTitle={fileTitle} pageType="url" isPollingSummary={isPolling} />
              </div>
              
              <TabContent fileTitle={fileTitle} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UrlResults;
