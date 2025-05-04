import { ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from './types';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

const VideoCard = ({ video, onPlay }: VideoCardProps) => {
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
  
  // Use thumbnailUrl with fallback to thumbnail for backward compatibility
  const thumbnailUrl = video.thumbnailUrl || video.thumbnail || '';

  return (
    <Card className="overflow-hidden">
      <div 
        className="relative h-40 bg-gray-200 cursor-pointer flex items-center justify-center"
        onClick={() => onPlay(video)}
      >
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Play className="h-12 w-12 text-primary" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center hover:bg-opacity-40 transition-opacity">
          <Play className="h-12 w-12 text-white" />
        </div>
      </div>
      <CardHeader className="py-3">
        <CardTitle className="text-base">{video.title}</CardTitle>
        {video.description && (
          <CardDescription className="line-clamp-2">
            {video.description}
          </CardDescription>
        )}
        {video.channelTitle && (
          <div className="text-xs text-gray-500 mt-1">
            {video.channelTitle}
            {video.publishedAt && (
              <span> • {new Date(video.publishedAt).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="flex gap-2">
          <Button 
            onClick={() => onPlay(video)}
            className="flex-grow"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" /> Play Video
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Use video.url directly if available, otherwise construct from videoId
              const url = video.url || `https://www.youtube.com/watch?v=${getVideoId(video)}`;
              window.open(url, '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
