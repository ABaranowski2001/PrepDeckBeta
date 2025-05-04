import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, FileText, Plus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { handleGenericError } from '@/utils/errorHandling';
import { Button } from '@/components/ui/button';
import { useFileState } from '@/contexts/ModuleContext';
import { useProcessUpload } from '@/hooks/useProcessUpload';

interface UserFile {
  fileName: string;
  createdAt: string;
  fileType: 'pdf' | 'url';
}

const UserLanding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setCurrentFile } = useFileState();
  const { handleSubmit } = useProcessUpload();
  const [isLoading, setIsLoading] = useState(true);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserFiles = async () => {
      setIsLoading(true);
      try {
        // Fetch all PDF Summary entries for this user
        const { data: pdfData, error: pdfError } = await supabase
          .from("PDF Summary")
          .select("\"File Name\"")
          .eq("User_ID", user.id);
        
        if (pdfError) {
          throw new Error(`Error fetching PDF files: ${pdfError.message}`);
        }
        
        // Fetch all URL Summary entries for this user
        const { data: urlData, error: urlError } = await supabase
          .from("URL Summary")
          .select("\"File Name\"")
          .eq("User_ID", user.id);
        
        if (urlError) {
          throw new Error(`Error fetching URL files: ${urlError.message}`);
        }
        
        // Process the data into our UserFile format
        const pdfFiles = pdfData ? pdfData.map(file => ({
          fileName: file['File Name'],
          createdAt: new Date().toISOString(), // We don't have created_at in the db, so using current time
          fileType: 'pdf' as const
        })) : [];
        
        const urlFiles = urlData ? urlData.map(file => ({
          fileName: file['File Name'],
          createdAt: new Date().toISOString(), // We don't have created_at in the db, so using current time
          fileType: 'url' as const
        })) : [];
        
        // Combine the two arrays and sort by fileName
        const combinedFiles = [...pdfFiles, ...urlFiles]
          .sort((a, b) => a.fileName.localeCompare(b.fileName));
        
        // Remove duplicates (if a file appears in both PDF and URL tables)
        const uniqueFiles = combinedFiles.filter((file, index, self) =>
          index === self.findIndex((f) => f.fileName === file.fileName)
        );
        
        setUserFiles(uniqueFiles);
      } catch (error) {
        console.error("Error fetching user files:", error);
        handleGenericError(error, "Failed to load your files");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserFiles();
  }, [user]);

  const handleFileClick = async (file: UserFile) => {
    setIsProcessing(true);
    try {
      if (file.fileType === 'pdf') {
        // For PDF files, we need to create a File object to pass to handleSubmit
        // First, set the current file in context
        const fileObj = new File(
          [new Blob([''], { type: 'application/pdf' })], // Empty content as a placeholder
          file.fileName,
          { type: 'application/pdf' }
        );
        
        setCurrentFile({
          name: file.fileName,
          type: 'application/pdf'
        });
        
        // Process the file using the same handler as new uploads
        await handleSubmit(fileObj);
      } else {
        // For URL files, just navigate to the URL results page
        setCurrentFile({
          name: file.fileName,
          type: 'url'
        });
        navigate('/url-results');
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error", { description: "Failed to process the selected file" });
      navigate(file.fileType === 'pdf' ? '/results' : '/url-results');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow gradient-bg pt-20 flex items-center justify-center">
          <div className="apple-card p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-spin" />
            <p className="text-xl font-medium">Loading your files...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow gradient-bg">
        <div className="section-container py-16">
          <div className="grid grid-cols-1 gap-6">
            <div className="apple-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Documents</h1>
                <Button 
                  onClick={() => navigate('/upload')}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>Upload New</span>
                </Button>
              </div>
              
              {userFiles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No documents yet</h3>
                  <p className="text-gray-500 mb-6">Upload your first document to get started</p>
                  <Link to="/upload">
                    <Button className="flex mx-auto items-center gap-2">
                      <Upload size={16} />
                      <span>Upload Document</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {userFiles.map((file) => (
                    <div 
                      key={file.fileName}
                      onClick={() => handleFileClick(file)}
                      className="cursor-pointer group transition-all relative"
                    >
                      {/* Folder design */}
                      <div className="aspect-square w-24 mx-auto bg-blue-100 rounded-md shadow group-hover:shadow-md transition-all overflow-hidden group-hover:bg-blue-200">
                        {/* Folder tab */}
                        <div className="h-[12%] w-[30%] bg-blue-300 rounded-br-md"></div>
                        
                        {/* Document type icon */}
                        <div className="flex justify-center items-center h-full -mt-[12%]">
                          {file.fileType === 'pdf' ? (
                            <FileText className="h-10 w-10 text-blue-600 opacity-70 group-hover:opacity-90 transition-opacity" />
                          ) : (
                            <ExternalLink className="h-10 w-10 text-blue-600 opacity-70 group-hover:opacity-90 transition-opacity" />
                          )}
                        </div>
                      </div>
                      
                      {/* Processing overlay */}
                      {isProcessing && (
                        <div className="absolute inset-0 top-0 left-1/2 transform -translate-x-1/2 w-24 aspect-square bg-white/80 rounded-md flex items-center justify-center">
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-7 w-7 text-blue-500 animate-spin mb-1" />
                            <span className="text-xs font-medium text-blue-700">Processing...</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Document title */}
                      <div className="mt-2 text-center">
                        <h3 className="font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors text-xs">
                          {file.fileName.replace(/\.[^/.]+$/, "")}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLanding; 