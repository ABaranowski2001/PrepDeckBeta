
import { FileText } from 'lucide-react';
import { FileUploadState, FileUploadActions } from '@/hooks/useFileUpload';

interface UploadAreaProps {
  state: FileUploadState;
  actions: FileUploadActions;
}

const UploadArea = ({ state, actions }: UploadAreaProps) => {
  const { preview, isDragging, file } = state;
  const { handleDragOver, handleDragLeave, handleDrop, fileInputRef, handleFileChange } = actions;

  return (
    <div 
      className={`relative h-64 mb-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300 cursor-pointer ${
        isDragging 
          ? 'border-blue-400 bg-blue-50' 
          : file 
            ? 'border-blue-400 bg-white' 
            : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />
      
      {file ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
          <p className="text-base font-medium text-gray-900">{file.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB - PDF document
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-2">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm md:text-base text-gray-600">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs md:text-sm text-gray-500">PDF files up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
