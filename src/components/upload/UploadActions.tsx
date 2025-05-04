
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploadState, FileUploadActions } from '@/hooks/useFileUpload';

interface UploadActionsProps {
  state: FileUploadState;
  actions: FileUploadActions;
  onSubmit: () => Promise<void>;
  isProcessing?: boolean;
}

const UploadActions = ({ state, actions, onSubmit, isProcessing = false }: UploadActionsProps) => {
  const { file, isLoading } = state;
  const { handleUploadClick } = actions;

  return (
    <div className="flex flex-col space-y-4">
      <Button 
        variant="outline" 
        size="lg" 
        className="h-14 text-base font-medium rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 border-0 transition-all duration-300"
        onClick={handleUploadClick}
        disabled={isProcessing}
      >
        <Upload className="mr-2 h-5 w-5" /> Upload PDF
      </Button>
      
      <Button 
        size="lg" 
        className="h-14 text-base font-medium rounded-full bg-apple-blue hover:bg-blue-600 transition-all duration-300"
        onClick={onSubmit}
        disabled={!file || isLoading || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
          </>
        ) : (
          'Process Content'
        )}
      </Button>
    </div>
  );
};

export default UploadActions;

