
import { Video as VideoIcon } from 'lucide-react';
import Videos from '@/components/Videos';
import { Video } from '@/components/video/types';
import PanelContainer from '@/components/panels/PanelContainer';

interface VideoPanelProps {
  videoData: any;
  isPending?: boolean;
  activeVideo: Video | null;
  setActiveVideo: (video: Video | null) => void;
  isTabActive: boolean;
  additionalResponse?: any;
}

const VideoPanel = ({ 
  videoData, 
  isPending, 
  activeVideo, 
  setActiveVideo, 
  isTabActive,
  additionalResponse 
}: VideoPanelProps) => {
  console.log("VideoPanel rendering with additionalResponse:", additionalResponse ? 'exists' : 'null');
  console.log("VideoPanel rendering with videoData:", videoData);

  const hasVideos = videoData && videoData.videos && videoData.videos.length > 0;

  return (
    <PanelContainer
      isPending={isPending || false}
      loadingTitle="Finding related videos"
      loadingDescription="We're searching for videos related to your document."
      icon={!hasVideos && <VideoIcon className="h-12 w-12 text-gray-400" />}
      emptyTitle={!hasVideos ? "No videos available for this content." : undefined}
      debugData={!hasVideos ? additionalResponse : undefined}
    >
      {hasVideos && (
        <Videos 
          title={videoData.title || "Educational Videos"} 
          videos={videoData.videos}
          activeVideo={activeVideo}
          onVideoChange={setActiveVideo}
          isTabActive={isTabActive}
        />
      )}
    </PanelContainer>
  );
};

export default VideoPanel;
