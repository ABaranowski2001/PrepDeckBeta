
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Define all webhook URLs in an array to loop through them
const WEBHOOK_URLS = [
  "https://hook.eu2.make.com/t8a3rxpblyecdd38h1fplo3bnex5ys7u",
  "https://hook.eu2.make.com/omelxsl5cvdumrxsa4l9rhgiaca5v8ga",
  "https://hook.eu2.make.com/eg5wbgkvftfhhh8lfep9ueiqvifegfej",
  "https://hook.eu2.make.com/68sxm0od45fjelr0wg2zuos7q63difj8",
  "https://hook.eu2.make.com/x18ia4po91d8io4ju14pe48g7deyu4b3"
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse the incoming request
    const formData = await req.formData();
    const file = formData.get('file');
    const userId = formData.get('user_id');
    
    if (!file || !(file instanceof File)) {
      throw new Error('No valid file provided');
    }
    
    // Log what we received
    console.log('Edge function received file data:', {
      filename: file.name,
      type: file.type,
      size: file.size,
      userId: userId || 'anonymous',
    });

    // Create a new FormData to forward to the webhooks
    const outgoingFormData = new FormData();
    outgoingFormData.append('file', file);
    outgoingFormData.append('filename', file.name);
    outgoingFormData.append('filetype', file.type);
    outgoingFormData.append('filesize', file.size.toString());
    
    if (userId) {
      outgoingFormData.append('user_id', userId.toString());
    }

    // Send to all Make webhooks concurrently
    const responses = await Promise.allSettled(
      WEBHOOK_URLS.map(async (webhookUrl) => {
        console.log(`Forwarding to webhook: ${webhookUrl}`);
        
        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            body: outgoingFormData,
          });
          
          const responseText = await response.text();
          const status = response.status;
          
          console.log(`Webhook ${webhookUrl} responded with status ${status}`);
          
          if (!response.ok) {
            console.error(`Webhook error: ${responseText}`);
            return { 
              url: webhookUrl,
              success: false, 
              status,
              error: responseText
            };
          }
          
          console.log(`Webhook success: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`);
          return { 
            url: webhookUrl,
            success: true, 
            status,
            response: responseText
          };
        } catch (error) {
          console.error(`Error sending to webhook ${webhookUrl}:`, error.message);
          return { 
            url: webhookUrl,
            success: false, 
            error: error.message
          };
        }
      })
    );

    const results = responses.map((result, index) => {
      const webhook = WEBHOOK_URLS[index];
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          url: webhook,
          success: false,
          error: result.reason?.message || 'Unknown error'
        };
      }
    });

    // Count successful and failed webhooks
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.length - successCount;

    console.log(`Webhook summary: ${successCount} succeeded, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `File processed: ${successCount} webhooks succeeded, ${failedCount} failed`,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
