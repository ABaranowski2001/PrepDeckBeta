
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WebhookDebugPanelProps {
  webhookData: {
    primary?: any;
    secondary?: any;
    [key: string]: any;
  };
}

const WebhookDebugPanel = ({ webhookData }: WebhookDebugPanelProps) => {
  const formatData = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Alert>
        <AlertDescription>
          Raw Webhook Data (Debug Mode)
        </AlertDescription>
      </Alert>
      
      <ScrollArea className="h-[500px] w-full rounded-md border p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Primary Webhook Response:</h3>
            <pre className="bg-slate-50 p-4 rounded-md overflow-x-auto">
              {formatData(webhookData.primary)}
            </pre>
          </div>
          
          {webhookData.secondary && (
            <div>
              <h3 className="font-medium mb-2">Secondary Webhook Response:</h3>
              <pre className="bg-slate-50 p-4 rounded-md overflow-x-auto">
                {formatData(webhookData.secondary)}
              </pre>
            </div>
          )}
          
          {Object.entries(webhookData)
            .filter(([key]) => !['primary', 'secondary'].includes(key))
            .map(([key, value]) => (
              <div key={key}>
                <h3 className="font-medium mb-2">{key} Response:</h3>
                <pre className="bg-slate-50 p-4 rounded-md overflow-x-auto">
                  {formatData(value)}
                </pre>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WebhookDebugPanel;
