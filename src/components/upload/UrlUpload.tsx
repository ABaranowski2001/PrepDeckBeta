import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, Loader2 } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { toast } from 'sonner';
import { useSummaryModule } from '@/contexts/ModuleContext';
import { useFileState } from '@/contexts/ModuleContext';
import { useAuth } from '@/contexts/AuthContext';
import { URL_WEBHOOKS } from '@/services/module/webhookUrls';

const UrlUpload = () => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearAllContent } = useContent();
  const { setSummaryData } = useSummaryModule();
  const { setCurrentFile } = useFileState();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!url) {
      toast("No URL provided", {
        description: "Please enter a valid website URL"
      });
      return;
    }

    // Ensure URL has proper protocol
    let processedUrl = url;
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    try {
      setIsProcessing(true);
      clearAllContent();
      
      if (URL_WEBHOOKS.length === 0) {
        console.error("No URL webhooks configured");
        throw new Error("No URL webhooks configured");
      }
      
      console.log(`Sending URL to ${URL_WEBHOOKS.length} webhooks:`, processedUrl);

      // Create payload with URL and user ID
      const payload = {
        url: processedUrl,
        user_id: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      };
      
      // Send URL to all webhooks in parallel
      const webhookPromises = URL_WEBHOOKS.map(async (webhookUrl, index) => {
        try {
          console.log(`Sending to webhook ${index + 1}:`, webhookUrl);
          
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Webhook ${index + 1} response not OK:`, response.status, errorText);
            return { success: false, url: webhookUrl, error: `Status ${response.status}` };
          }
          
          const responseText = await response.text();
          console.log(`Webhook ${index + 1} response:`, responseText);
          return { success: true, url: webhookUrl, response: responseText };
        } catch (error) {
          console.warn(`Error calling webhook ${index + 1}:`, error);
          return { success: false, url: webhookUrl, error: String(error) };
        }
      });
      
      // Wait for all webhook calls to complete
      const results = await Promise.all(webhookPromises);
      
      // Count successes and failures
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      
      if (successCount === 0) {
        throw new Error("All webhook calls failed");
      }

      // Create a virtual file for the URL to use in the file context
      const urlDomain = new URL(processedUrl).hostname;
      const urlFile = new File(
        [processedUrl], // content
        `URL: ${urlDomain}`, // filename
        { type: 'text/plain' } // mimetype
      );
      
      // Set the current file so the results page knows we have a file
      setCurrentFile(urlFile);
      
      // Store the processed text in the summary module
      setSummaryData({
        processed: `URL processed: ${processedUrl}. We're monitoring for results.`,
        original: processedUrl  // Store the original URL as the original text
      });

      toast.success("URL sent for processing", {
        description: `Your URL has been sent to ${successCount} webhook${successCount !== 1 ? 's' : ''}${failureCount > 0 ? ` (${failureCount} failed)` : ''}.`
      });
      
      // Navigate directly to URL results page for troubleshooting
      navigate('/url-results', { replace: true });
    } catch (error) {
      console.error("Error processing URL:", error);
      toast.error("Processing Error", {
        description: "There was a problem processing your URL. Please make sure it's valid and try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className="relative h-64 mb-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300 border-gray-300 bg-gray-50/50 hover:bg-gray-100/50 cursor-pointer"
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'url';
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value) {
              setUrl(target.value);
            }
          };
          input.click();
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-2">
            <Link className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm md:text-base text-gray-600">
              <span className="font-medium">Enter a website URL</span> to process
            </p>
            <p className="text-xs md:text-sm text-gray-500">URLs from public websites</p>
          </div>
        </div>
        
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-4 w-full"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div className="mt-6">
        <Button 
          size="lg" 
          className="h-14 text-base font-medium rounded-full bg-apple-blue hover:bg-blue-600 transition-all duration-300 w-full"
          onClick={handleSubmit}
          disabled={!url || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
            </>
          ) : (
            'Process Website URL'
          )}
        </Button>
      </div>
    </div>
  );
};

export default UrlUpload;
