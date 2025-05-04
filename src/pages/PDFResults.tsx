import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { useFileState, useSummaryModule } from '@/contexts/ModuleContext';
import SummaryPanel from './results/SummaryPanel';
import TabContent from './results/TabContent';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { handleGenericError } from '@/utils/errorHandling';

const Results = () => {
  const { currentFile } = useFileState();
  const { setSummaryData } = useSummaryModule();
  const navigate = useNavigate();
  const location = useLocation();
  const [isContentReady, setIsContentReady] = useState(false);
  const { user } = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🌈 Results page mounted, currentFile:", currentFile ? currentFile.name : "none");

    const checkFile = setTimeout(() => {
      if (!currentFile && !location.state?.file) {
        console.log("No file found in context, redirecting to upload");
        toast("No file found", {
          description: "Please upload a file first"
        });
        navigate('/upload');
      } else {
        setIsContentReady(true);
      }
    }, 500);

    return () => clearTimeout(checkFile);
  }, [currentFile, navigate, location.state]);

  // Fetch Supabase data for the current user & file
  useEffect(() => {
    const fetchSupabaseData = async () => {
      if (!user?.id || !currentFile?.name) return;
      setIsFetching(true);
      setFetchError(null);
      try {
        // Match both user id and file name, but don't try to sort by created_at anymore
        const { data, error } = await supabase
          .from("PDF Summary")
          .select("*")
          .eq("User_ID", user.id)
          .eq("File Name", currentFile.name);

        if (error) {
          setFetchError("Could not fetch your file summary data.");
          console.error("Supabase fetch error:", error);
        } else if (data && data.length > 0) {
          // Just use the first entry (we can't sort by date since there's no date column)
          const firstData = data[0];
          console.log("First data from database:", firstData);
          
          // Populate summary data if present
          if (firstData.Summary) {
            setSummaryData({ processed: firstData.Summary, original: null });
            console.log("Summary data loaded successfully");
          }
          
          // Log all data received for debugging purposes
          console.log("All data entries for this file:", data);
        } else {
          toast("Could not find processed data for your file.", { 
            description: "You may need to wait for the processing to finish." 
          });
          console.log("No data found for file:", currentFile.name);
        }
      } catch (err) {
        setFetchError("A problem occurred while loading file data.");
        handleGenericError(err, "Error loading file data");
      }
      setIsFetching(false);
    };
    
    fetchSupabaseData();
    // Only trigger when currentFile and user are set
  }, [user, currentFile, setSummaryData]);

  const fileTitle = currentFile ? currentFile.name.replace(/\.\w+$/, '') : "Your Document";

  if (!currentFile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow gradient-bg pt-20 flex items-center justify-center">
          <div className="apple-card p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-spin" />
            <p className="text-xl font-medium">Checking for uploaded file...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow gradient-bg pt-20 flex items-center justify-center">
          <div className="apple-card p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-spin" />
            <p className="text-xl font-medium">Loading your processed file data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow gradient-bg pt-20 flex items-center justify-center">
          <div className="apple-card p-8 text-center space-y-4">
            <div className="text-red-600 mb-4">{fetchError}</div>
            <p className="text-gray-500">Try re-uploading the file or contact support if the problem persists.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="gradient-bg pt-4">
          <div className="section-container pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="apple-card shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
                <SummaryPanel fileTitle={fileTitle} pageType="pdf" />
              </div>
              <TabContent fileTitle={fileTitle} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
