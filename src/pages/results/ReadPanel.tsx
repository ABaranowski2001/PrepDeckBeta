import { Text } from '@/components/read/types';
import Read from '@/components/Read';
import PanelContainer from '@/components/panels/PanelContainer';
import { Book, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFetchUserRead } from '@/hooks/useFetchUserRead';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFileState } from '@/contexts/ModuleContext';

interface ReadPanelProps {
  isTabActive: boolean;
}

const ReadPanel = ({ isTabActive }: ReadPanelProps) => {
  // Get texts data directly from the hook
  const { texts, title, isLoading, error } = useFetchUserRead();
  const [activeText, setActiveText] = useState<Text | null>(null);
  const [rawData, setRawData] = useState<any>(null);
  const [showRawData, setShowRawData] = useState(false);
  const { user } = useAuth();
  const { currentFile } = useFileState();
  
  const hasTexts = texts && texts.length > 0;

  // Debug logging
  useEffect(() => {
    if (isTabActive) {
      console.log("ReadPanel - tab is active");
      console.log("ReadPanel - texts:", texts);
      console.log("ReadPanel - texts count:", texts?.length || 0);
      console.log("ReadPanel - isLoading:", isLoading);
      console.log("ReadPanel - error:", error);
      console.log("ReadPanel - hasTexts:", hasTexts);
    }
  }, [isTabActive, texts, isLoading, error, hasTexts]);

  // Create debug data to display when empty
  const debugData = {
    texts_received: texts,
    texts_count: texts?.length || 0,
    has_texts: hasTexts,
    is_loading: isLoading,
    error: error
  };

  // Function to fetch raw data
  const fetchRawData = async () => {
    if (!user?.id || !currentFile?.name) return;
    
    try {
      const { data, error } = await supabase
        .from("PDF Read")
        .select("*")
        .eq("User_ID", user.id)
        .eq("File Name", currentFile.name);
      
      if (error) {
        console.error("Error fetching raw read data:", error);
      } else {
        console.log("Raw PDF Read data:", data);
        setRawData(data);
        setShowRawData(true);
      }
    } catch (e) {
      console.error("Exception fetching raw data:", e);
    }
  };

  // If showing raw data, display it
  if (showRawData && rawData) {
    return (
      <div className="h-full overflow-auto p-4">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Raw PDF Read Data</h3>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setShowRawData(false)}>
            Back to Texts
          </button>
        </div>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-[calc(100vh-10rem)]">
          {JSON.stringify(rawData, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <PanelContainer
      isPending={isLoading}
      loadingTitle="Finding recommended texts"
      loadingDescription="We're searching for academic texts related to your document."
      icon={!hasTexts && <Book className="h-12 w-12 text-gray-400" />}
      emptyTitle={!hasTexts && !error ? "No academic texts available for this content." : undefined}
      error={error}
      debugData={!hasTexts ? debugData : undefined}
    >
      {!hasTexts && !isLoading && !error && (
        <div className="absolute top-4 right-4">
          <button 
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded flex items-center text-xs"
            onClick={fetchRawData}>
            <Database className="h-3 w-3 mr-1" />
            View Raw Data
          </button>
        </div>
      )}
      
      {hasTexts && (
        <Read
          title={title}
          texts={texts}
          activeText={activeText}
          onTextChange={setActiveText}
          isTabActive={isTabActive}
        />
      )}
    </PanelContainer>
  );
};

export default ReadPanel;
