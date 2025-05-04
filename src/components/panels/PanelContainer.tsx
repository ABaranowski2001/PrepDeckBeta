import { ReactNode, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface PanelContainerProps {
  isPending: boolean;
  loadingTitle: string;
  loadingDescription: string;
  icon?: ReactNode;
  emptyTitle?: string;
  error?: string | null;
  children: ReactNode;
  debugData?: any;
}

const PanelContainer = ({ 
  isPending, 
  loadingTitle, 
  loadingDescription, 
  icon, 
  emptyTitle,
  error, 
  children,
  debugData
}: PanelContainerProps) => {
  // Add debugging log
  useEffect(() => {
    console.log("PanelContainer rendered with:", {
      isPending,
      hasChildren: !!children,
      hasError: !!error,
      hasEmptyTitle: !!emptyTitle
    });
  }, [isPending, children, error, emptyTitle]);

  if (isPending) {
    console.log("PanelContainer: Showing loading state");
    return (
      <div className="h-full p-6 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
        <h3 className="text-lg font-medium mb-2">{loadingTitle}</h3>
        <p className="text-gray-500 text-center">{loadingDescription}</p>
      </div>
    );
  }
  
  if (error) {
    console.log("PanelContainer: Showing error state:", error);
    return (
      <div className="h-full p-6 flex flex-col items-center justify-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p className="text-gray-500 text-center">{error}</p>
      </div>
    );
  }

  if (emptyTitle) {
    console.log("PanelContainer: Showing empty state with title:", emptyTitle);
    return (
      <div className="h-full p-6 flex flex-col items-center justify-center">
        {icon && <div className="mb-4">{icon}</div>}
        <p className="text-gray-500">{emptyTitle}</p>
        {/* Display debug data if available */}
        {debugData && (
          <pre className="mt-4 text-xs text-gray-500 max-h-64 overflow-auto p-2 border border-gray-200 rounded">
            {typeof debugData === 'string' ? debugData : JSON.stringify(debugData, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  // Add check for null or undefined children
  if (!children) {
    console.log("PanelContainer: Children is null or undefined");
    return (
      <div className="h-full p-6 flex flex-col items-center justify-center">
        <AlertCircle className="h-10 w-10 text-orange-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Content</h3>
        <p className="text-gray-500 text-center">No content is available to display.</p>
      </div>
    );
  }

  console.log("PanelContainer: Rendering children");
  return <>{children}</>;
};

export default PanelContainer;
