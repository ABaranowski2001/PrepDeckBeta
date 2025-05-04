import { createFormData, callWebhook, WebhookResult } from './webhookUtils';
import { toast } from 'sonner';
import webhooks from './webhooks.json';

// Define the webhook responses type
interface WebhookResponses {
  primary: string | null;
  secondary: string | null;
  tertiary: string | null;
  cardGame: any[] | { cards: any[], title?: string } | null;
  quiz: { questions: any[], title?: string } | null;
  additional: any[] | null;
  read: { texts: any[], title?: string } | null;
  videos?: { videos: any[], title?: string } | null;
  _debug?: {
    primary?: any;
    secondary?: any;
    allWebhooks?: any[];
    [key: string]: any;
  };
}

export const sendToMakeWebhook = async (file: File): Promise<WebhookResponses> => {
  console.log("🔍 Starting webhook data processing");
  
  const formData = createFormData(file);
  const isPdf = file.type === 'application/pdf';
  
  try {
    // Store raw debug data
    const debugData: any = { allWebhooks: [] };
    
    // Get all webhook URLs from our JSON config file
    const allWebhookUrls = webhooks.pdf_webhooks || [];
    
    if (allWebhookUrls.length === 0) {
      console.warn("No webhook URLs are configured");
      return {
        primary: `Processed ${file.name} (no webhooks configured)`,
        secondary: null,
        tertiary: null,
        cardGame: null,
        quiz: null,
        read: null,
        additional: null,
        _debug: { note: "No webhook URLs configured" }
      };
    }
    
    // Primary webhook is still the first one in the list
    const primaryWebhookUrl = allWebhookUrls[0] || '';
    
    // Primary webhook call
    const primaryResult = await callWebhook(
      primaryWebhookUrl,
      formData,
      'primary upload'
    );
    
    // Store raw primary response
    debugData.primary = primaryResult.data;
    
    // Send to all webhooks in parallel (except primary which was already called)
    const webhookPromises = allWebhookUrls.slice(1).map(async (url, index) => {
      try {
        const webhookFormData = createFormData(file);
        if (primaryResult.data) {
          webhookFormData.append('primary_response', 
            typeof primaryResult.data === 'string' 
              ? primaryResult.data 
              : JSON.stringify(primaryResult.data)
          );
        }
        
        const result = await callWebhook(
          url,
          webhookFormData,
          `webhook-${index + 2}` // +2 because index starts at 0 and we're skipping the primary (1)
        );
        
        debugData.allWebhooks.push({
          url,
          response: result.data,
          success: result.success
        });
        
        return result;
      } catch (webhookError) {
        console.warn(`Webhook call to ${url} failed:`, webhookError);
        debugData.allWebhooks.push({
          url,
          error: webhookError,
          success: false
        });
        return null;
      }
    });
    
    // Wait for all webhook calls to complete
    const webhookResults = await Promise.allSettled(webhookPromises);
    
    // Use the secondary result for backward compatibility
    const secondaryResult = webhookResults[0]?.status === 'fulfilled' 
      ? webhookResults[0].value 
      : null;
    
    if (primaryResult.success) {
      // Initialize module data containers
      let processedText = null;
      let originalText = null;
      let cardGameData = null;
      let quizData = null;
      let readData = null;
      let additionalData = null;
      let videosData = null;

      // Process primary response data
      try {
        const primaryData = typeof primaryResult.data === 'string' 
          ? JSON.parse(primaryResult.data)
          : primaryResult.data;

        if (primaryData && typeof primaryData === 'object') {
          if (primaryData.type === 'pdf_cards' && Array.isArray(primaryData.cards)) {
            console.log("Processing cards data");
            cardGameData = primaryData;
          } else if (primaryData.type === 'quiz' && Array.isArray(primaryData.questions)) {
            console.log("Processing quiz data");
            quizData = primaryData;
          } else if (primaryData.type === 'read' && Array.isArray(primaryData.texts)) {
            console.log("Processing read data");
            readData = primaryData;
          } else if (primaryData.type === 'video' && Array.isArray(primaryData.videos)) {
            console.log("Processing video data");
            videosData = primaryData;
          } else {
            processedText = primaryData.summary || primaryData.text || primaryData;
            originalText = primaryData.originalText || null;
          }
        }
      } catch (parseError) {
        console.warn("Primary response parsing error:", parseError);
        processedText = typeof primaryResult.data === 'string' ? primaryResult.data : "Parsing failed";
      }

      // Process all webhook responses
      webhookResults.forEach((webhookResult, index) => {
        if (webhookResult.status === 'fulfilled' && webhookResult.value?.data) {
          try {
            const webhookData = typeof webhookResult.value.data === 'string'
              ? JSON.parse(webhookResult.value.data)
              : webhookResult.value.data;

            if (webhookData && typeof webhookData === 'object') {
              console.log(`Processing webhook ${index + 2} data type:`, webhookData.type);
              
              switch(webhookData.type) {
                case 'pdf_cards':
                  if (!cardGameData) cardGameData = webhookData;
                  break;
                case 'quiz':
                  if (!quizData) quizData = webhookData;
                  break;
                case 'read':
                  if (!readData) readData = webhookData;
                  break;
                case 'video':
                  if (!videosData) videosData = webhookData;
                  break;
                default:
                  if (!additionalData) additionalData = webhookData;
              }
            }
          } catch (error) {
            console.warn(`Webhook ${index + 2} data parsing error:`, error);
          }
        }
      });

      // Store debug data
      localStorage.setItem('webhook_debug_data', JSON.stringify(debugData));

      return {
        primary: processedText,
        secondary: originalText,
        tertiary: additionalData ? (typeof additionalData === 'string' ? additionalData : JSON.stringify(additionalData)) : null,
        cardGame: cardGameData,
        quiz: quizData,
        read: readData,
        videos: videosData,
        additional: additionalData ? [additionalData] : null,
        _debug: debugData
      };
    } else {
      console.error("Primary Webhook Error:", primaryResult.error);
      
      // Return fallback response when webhook fails
      return {
        primary: `Processed ${file.name} (webhook failed)`,
        secondary: null,
        tertiary: null,
        cardGame: null,
        quiz: null,
        read: null,
        videos: null,
        additional: null,
        _debug: { error: primaryResult.error }
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("🚨 Webhook Error:", errorMessage);
    
    // Return error response
    return {
      primary: `Error processing ${file.name}`,
      secondary: null,
      tertiary: null,
      cardGame: null,
      quiz: null,
      read: null,
      videos: null,
      additional: null,
      _debug: { error: errorMessage }
    };
  }
};
