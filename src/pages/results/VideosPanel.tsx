import { Video as VideoIcon, Database } from 'lucide-react';
import Videos from '@/components/Videos';
import { Video } from '@/components/video/types';
import PanelContainer from '@/components/panels/PanelContainer';
import { useState, useEffect } from 'react';
import { useFetchUserVideos } from '@/hooks/useFetchUserVideos';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFileState } from '@/contexts/ModuleContext';

interface VideosPanelProps {
  isTabActive: boolean;
}

const VideosPanel = ({ isTabActive }: VideosPanelProps) => {
  // Get videos data directly from the hook
  const { videos, title, isLoading, error } = useFetchUserVideos();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [rawData, setRawData] = useState<any>(null);
  const [showRawData, setShowRawData] = useState(false);
  const { user } = useAuth();
  const { currentFile } = useFileState();
  
  // Debug logging
  useEffect(() => {
    if (isTabActive) {
      console.log("VideosPanel - tab is active");
      console.log("VideosPanel - videos:", videos);
      console.log("VideosPanel - videos count:", videos?.length || 0);
      console.log("VideosPanel - isLoading:", isLoading);
      console.log("VideosPanel - error:", error);
    }
  }, [isTabActive, videos, isLoading, error]);
  
  const hasVideos = videos && videos.length > 0;

  // Create debug data to display when empty
  const debugData = {
    videos_received: videos,
    videos_count: videos?.length || 0,
    has_videos: hasVideos,
    is_loading: isLoading,
    error: error
  };

  // Function to fetch raw data
  const fetchRawData = async () => {
    if (!user?.id || !currentFile?.name) return;
    
    try {
      const { data, error } = await supabase
        .from("PDF Video")
        .select("*")
        .eq("User_ID", user.id)
        .eq("File Name", currentFile.name);
      
      if (error) {
        console.error("Error fetching raw video data:", error);
      } else {
        console.log("Raw PDF Video data:", data);
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
          <h3 className="text-lg font-medium">Raw PDF Video Data</h3>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setShowRawData(false)}>
            Back to Videos
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
      loadingTitle="Finding related videos"
      loadingDescription="We're searching for videos related to your document."
      icon={!hasVideos && <VideoIcon className="h-12 w-12 text-gray-400" />}
      emptyTitle={!hasVideos && !error ? "No videos available for this content." : undefined}
      error={error}
      debugData={!hasVideos ? debugData : undefined}
    >
      {!hasVideos && !isLoading && !error && (
        <div className="absolute top-4 right-4">
          <button 
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded flex items-center text-xs"
            onClick={fetchRawData}>
            <Database className="h-3 w-3 mr-1" />
            View Raw Data
          </button>
        </div>
      )}
      
      {hasVideos && (
        <Videos 
          title={title} 
          videos={videos}
          activeVideo={activeVideo}
          onVideoChange={setActiveVideo}
          isTabActive={isTabActive}
        />
      )}
    </PanelContainer>
  );
};

export default VideosPanel;
