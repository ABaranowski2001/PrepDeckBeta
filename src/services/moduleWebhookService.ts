
// Re-export all module functions from the new module structure
export {
  processAllWebhooks,
  callSummaryWebhook,
  callCardsWebhook,
  callQuizWebhook,
  callVideosWebhook,
  callReadWebhook
} from './module';

// Export type separately with proper syntax for TypeScript isolatedModules
export type { WebhookResult } from './module/webhookUtils';

