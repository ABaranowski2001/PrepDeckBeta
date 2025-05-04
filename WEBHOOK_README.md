# Webhook Centralization

## Overview
This change centralizes all webhooks used in the application into a single JSON file for easier management and configuration. Instead of having webhook URLs scattered across multiple files or stored in environment variables, they are now all defined in `src/services/webhooks.json`.

## Changes Made

1. Created a central `webhooks.json` file in the `src/services` directory that contains all webhook URLs
2. Updated `webhook.Urls.ts` to import webhook URLs from the JSON file
3. Modified `makeService.ts` to use webhook URLs from the JSON file instead of environment variables
4. Added TypeScript declaration file for JSON imports

## How to Use

### Viewing All Webhooks
All webhooks are now stored in `src/services/webhooks.json`. The file is organized as follows:

```json
{
  "pdf_webhooks": [
    "https://hook.eu2.make.com/t8a3rxpblyecdd38h1fplo3bnex5ys7u",
    "..."
  ],
  "module_webhook_urls": {
    "primary": "https://hook.eu2.make.com/t8a3rxpblyecdd38h1fplo3bnex5ys7u",
    "secondary": [
      "..."
    ]
  },
  "env_webhooks": {
    "primary_webhook_url": "https://hook.eu2.make.com/t8a3rxpblyecdd38h1fplo3bnex5ys7u",
    "secondary_webhook_url": "..."
  }
}
```

### Modifying Webhooks
To change a webhook URL, simply update the appropriate entry in the `webhooks.json` file. No changes to the code are needed.

### Adding New Webhooks
To add new webhooks:
1. Add the webhook URL to the appropriate section in `webhooks.json`
2. Import and use it in your code:

```typescript
import webhooks from '../webhooks.json';

// Use a webhook
const myWebhook = webhooks.new_section.my_webhook;
```

## Benefits
- Single source of truth for all webhook URLs
- Easier to update and maintain
- Better visibility of all webhooks in the system
- Eliminates duplicated URLs across the codebase
- No need to set environment variables for basic webhook functionality 