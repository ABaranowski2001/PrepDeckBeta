
import { useFileUpload } from '@/hooks/useFileUpload';
import { useProcessUpload } from '@/hooks/useProcessUpload';
import UploadArea from './upload/UploadArea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useContent } from '@/contexts/ContentContext';
import { useState } from 'react';

const FileUpload = () => {
  const [state, actions] = useFileUpload();
  const { isProcessing, handleSubmit } = useProcessUpload();
  const { clearAllContent } = useContent();
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const onSubmit = async () => {
    if (!state.file) {
      toast.error("No file selected", {
        description: "Please upload a file first"
      });
      return;
    }

    try {
      setUploadError(null);
      clearAllContent();
      console.log("Starting new file submission:", state.file.name);
      await handleSubmit(state.file);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error submitting file:", errorMessage);
      setUploadError(errorMessage);
      toast.error("Upload Error", {
        description: "There was a problem processing your file"
      });
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <UploadArea state={state} actions={actions} />
      
      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <p className="font-medium">Error during upload:</p>
          <p>{uploadError}</p>
        </div>
      )}
      
      <div className="mt-6">
        <Button 
          size="lg" 
          className="w-full h-14 text-base font-medium rounded-full bg-apple-blue hover:bg-blue-600 transition-all duration-300"
          onClick={onSubmit}
          disabled={!state.file || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
              Processing...
            </>
          ) : (
            'Process Content'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
