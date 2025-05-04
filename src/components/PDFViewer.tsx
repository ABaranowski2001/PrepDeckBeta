
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface PDFViewerProps {
  fileUrl: string | null;
  className?: string;
}

const PDFViewer = ({ fileUrl, className = '' }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when file URL changes
  useEffect(() => {
    if (fileUrl) {
      setIsLoading(true);
    }
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <p className="text-gray-500">No PDF file available</p>
      </div>
    );
  }

  // Create URL with #toolbar=0 parameter to hide toolbar
  const pdfUrlWithoutToolbar = fileUrl.includes('#') 
    ? `${fileUrl}&toolbar=0` 
    : `${fileUrl}#toolbar=0`;

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      )}
      <iframe
        src={pdfUrlWithoutToolbar}
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;
