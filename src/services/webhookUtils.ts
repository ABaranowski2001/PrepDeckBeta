
// Create a type for the webhook result
export interface WebhookResult {
  success: boolean;
  data: string | null;
  error?: string;
  status?: number;
}

// Helper function to safely parse JSON
const safeJsonParse = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.log("Failed to parse as JSON, returning text as is:", text);
    return text;
  }
};

// Helper function to create FormData
export const createFormData = (file: File): FormData => {
  const formData = new FormData();
  // Important: 'file' must be the field name expected by the receiving webhook
  formData.append('file', file);
  formData.append('filename', file.name);
  formData.append('filetype', file.type);
  formData.append('filesize', file.size.toString());
  // Add a timestamp to prevent caching issues
  formData.append('timestamp', new Date().toISOString());
  console.log("FormData created successfully:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });
  return formData;
};

// Generic function for calling a webhook
export const callWebhook = async (
  url: string, 
  formData: FormData, 
  name: string, 
  retries = 1, 
  timeoutMs = 30000
): Promise<WebhookResult> => {
  if (!url || url.trim() === '') {
    console.log(`Webhook URL for ${name} is empty, skipping`);
    return {
      success: false,
      data: null,
      error: "Webhook URL is empty",
      status: 400
    };
  }

  try {
    console.log(`Calling webhook ${name} at URL: ${url}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // IMPORTANT: Do not set Content-Type header when sending FormData
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    clearTimeout(timeoutId);
    
    console.log(`Webhook ${name} response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook ${name} failed with status ${response.status}. Response:`, errorText);
      return {
        success: false,
        data: null,
        error: `Server returned ${response.status}: ${errorText.substring(0, 100)}`,
        status: response.status
      };
    }

    const responseText = await response.text();
    console.log(`Webhook ${name} raw response:`, responseText);
    
    const parsedData = safeJsonParse(responseText);
    console.log(`Webhook ${name} parsed response:`, parsedData);

    return {
      success: true,
      data: parsedData,
      status: response.status
    };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    console.error(`Webhook ${name} ${isTimeout ? 'timed out' : 'failed'}: ${error}`);

    if (retries > 0) {
      console.log(`Retrying webhook ${name}, ${retries} attempts remaining`);
      return callWebhook(url, formData, name, retries - 1, timeoutMs);
    }

    return {
      success: false,
      data: null,
      error: isTimeout ? `Webhook timed out after ${timeoutMs}ms` : String(error),
      status: isTimeout ? 408 : 500
    };
  }
};
