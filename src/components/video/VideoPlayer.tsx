
import { useRef, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoDescription from './VideoDescription';
import { Video } from './types';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  isVisible: boolean;
  videoSrc: string;
  videoTime: number;
}

const VideoPlayer = ({ video, onClose, isVisible, videoSrc, videoTime }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const getVideoId = (video: Video): string => {
    if (!video.id) {
      return "";
    }
    
    if (typeof video.id === 'object' && 'videoId' in video.id) {
      return video.id.videoId;
    }
    
    if (typeof video.id === 'string') {
      return video.id;
    }
    
    return "";
  };

  // Poll for current time periodically to ensure we have the latest time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isVisible && iframeRef.current) {
      interval = setInterval(() => {
        try {
          const message = JSON.stringify({
            event: 'command',
            func: 'getCurrentTime'
          });
          iframeRef.current?.contentWindow?.postMessage(message, '*');
        } catch (e) {
          // Silent fail - iframe might not be ready
        }
      }, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVisible]);

  // When visibility changes, pause the video if it becomes invisible
  useEffect(() => {
    if (!isVisible && iframeRef.current) {
      try {
        // Request current time from the player
        const message = JSON.stringify({
          event: 'command',
          func: 'getCurrentTime'
        });
        iframeRef.current.contentWindow?.postMessage(message, '*');
        
        // Also pause the video
        const pauseMessage = JSON.stringify({
          event: 'command',
          func: 'pauseVideo'
        });
        iframeRef.current.contentWindow?.postMessage(pauseMessage, '*');
        console.log("Requesting video time before tab switch");
      } catch (e) {
        console.log("Could not request video time:", e);
      }
    }
  }, [isVisible]);

  return (
    <div className="flex-grow flex flex-col">
      <div className="relative w-full pt-[56.25%] bg-black">
        {isVisible && (
          <iframe
            ref={iframeRef}
            src={videoSrc}
            className="absolute top-0 left-0 w-full h-full"
            title={video.title}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        )}
        {!isVisible && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black">
            <p className="text-white">Video paused (switch to Watch tab to resume)</p>
          </div>
        )}
      </div>
      <div className="p-4 relative pb-16">
        <h3 className="text-xl font-medium mb-2">{video.title}</h3>
        
        <VideoDescription description={video.description} />
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const videoId = getVideoId(video);
              if (videoId) {
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
              } else if (video.url) {
                window.open(video.url, '_blank');
              }
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
