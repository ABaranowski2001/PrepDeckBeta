import { useState, useEffect } from 'react';
import { Video as VideoIcon } from 'lucide-react'; 
import { Video } from './video/types';
import VideoPlayer from './video/VideoPlayer';
import VideoList from './video/VideoList';
import { getVideoEmbedUrl } from './video/videoUtils';

interface VideosProps {
  title?: string;
  videos?: Video[];
  activeVideo?: Video | null;
  onVideoChange?: (video: Video | null) => void;
  isTabActive?: boolean;
}

const Videos = ({ 
  title = "Educational Videos", 
  videos = [],
  activeVideo = null,
  onVideoChange,
  isTabActive = true
}: VideosProps) => {
  const [videoTime, setVideoTime] = useState(0);
  const [isVisible, setIsVisible] = useState(isTabActive);
  const [videoSrc, setVideoSrc] = useState('');
  const [lastActiveVideo, setLastActiveVideo] = useState<Video | null>(null);
  
  // Use local state if no external control is provided
  const [localActiveVideo, setLocalActiveVideo] = useState<Video | null>(activeVideo);
  
  // The actual active video is either controlled externally or locally
  const currentActiveVideo = onVideoChange ? activeVideo : localActiveVideo;
  
  // Handle video change - either call the external handler or update local state
  const handleVideoChange = (video: Video | null) => {
    if (onVideoChange) {
      onVideoChange(video);
    } else {
      setLocalActiveVideo(video);
    }
  };
  
  // Store the last active video when it changes
  useEffect(() => {
    if (currentActiveVideo) {
      setLastActiveVideo(currentActiveVideo);
    }
  }, [currentActiveVideo]);

  // Reset active video when videos list changes (new upload)
  useEffect(() => {
    if (videos && videos.length > 0 && Array.isArray(videos)) {
      console.log("Videos list changed, resetting active video");
      handleVideoChange(null);
    }
  }, [videos]);

  // Update video source only when active video changes or when returning to tab with saved time
  useEffect(() => {
    if (currentActiveVideo) {
      // Use embedUrl if available, otherwise generate from url
      const baseUrl = currentActiveVideo.embedUrl || getVideoEmbedUrl(currentActiveVideo.url);
      
      // Check if we need to add parameters to the URL
      const hasParams = baseUrl.includes('?');
      
      // Add autoplay parameter if not already present in embedUrl
      const autoplayParam = !baseUrl.includes('autoplay=') ? 
        (hasParams ? '&autoplay=1' : '?autoplay=1') : '';
        
      // Add start time parameter if we have saved a position and we're loading the same video
      const timeParam = videoTime > 0 && lastActiveVideo?.id === currentActiveVideo.id ? 
        `${hasParams || autoplayParam ? '&' : '?'}start=${Math.floor(videoTime)}` : '';
      
      console.log("Setting video src with time param:", timeParam, "Video time:", videoTime);
      setVideoSrc(`${baseUrl}${autoplayParam}${timeParam}`);
    }
  }, [currentActiveVideo, isTabActive, videoTime, lastActiveVideo]);
  
  // Update visibility based on tab state
  useEffect(() => {
    const handleVisibilityChange = () => {
      const newVisibility = !document.hidden && isTabActive;
      setIsVisible(newVisibility);
      console.log("Visibility changed to:", newVisibility);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    setIsVisible(!document.hidden && isTabActive);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isTabActive]);

  // Listen for messages from the YouTube iframe API
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from YouTube iframe API
      if (typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data && data.info && typeof data.info.currentTime === 'number') {
            setVideoTime(data.info.currentTime);
            console.log("Saved video time:", data.info.currentTime);
          }
        } catch (e) {
          // Not a JSON message or doesn't have the expected format
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <VideoIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-center">No videos available for this content.</p>
      </div>
    );
  }

  console.log("Rendering Videos component with", videos.length, "videos");

  return (
    <div className="h-full flex flex-col">
      {currentActiveVideo ? (
        <VideoPlayer
          video={currentActiveVideo}
          onClose={() => handleVideoChange(null)}
          isVisible={isVisible}
          videoSrc={videoSrc}
          videoTime={videoTime}
        />
      ) : (
        <VideoList
          videos={videos}
          onVideoSelect={(video) => handleVideoChange(video)}
          title={title}
        />
      )}
    </div>
  );
};

export default Videos;
