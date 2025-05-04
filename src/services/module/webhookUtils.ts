// Create a type for the webhook result
export interface WebhookResult {
  success: boolean;
  data: string | null;
  error?: string;
  status?: number;
}

// Helper function to create FormData
export const createFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', file.name);
  formData.append('filetype', file.type);
  formData.append('filesize', file.size.toString());
  formData.append('seed', Math.random().toString());
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

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Webhook ${name} failed with status ${response.status}`);
      return {
        success: false,
        data: null,
        error: `Server returned ${response.status}`,
        status: response.status
      };
    }

    const responseText = await response.text();
    console.log(`Webhook ${name} success, received ${responseText.length} bytes`);

    return {
      success: true,
      data: responseText,
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
