// Import webhooks from the centralized JSON file
import webhooks from '../webhooks.json';

// Export a central array of webhooks for direct file sending
export const PDF_WEBHOOKS = webhooks.pdf_webhooks;

// Export URL webhooks
export const URL_WEBHOOKS = (webhooks as any).url_webhooks || [];

// Export under the previously used name for backward compatibility
export const MODULE_WEBHOOK_URLS = {
  primary: PDF_WEBHOOKS[0],
  secondary: PDF_WEBHOOKS.slice(1),
  all: PDF_WEBHOOKS
};
