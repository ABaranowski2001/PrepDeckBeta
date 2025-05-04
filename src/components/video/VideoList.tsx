
import { VideoIcon } from 'lucide-react';
import VideoCard from './VideoCard';
import { Video } from './types';

interface VideoListProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  title: string;
}

const VideoList = ({ videos, onVideoSelect, title }: VideoListProps) => {
  console.log("VideoList rendering with videos:", videos);

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <VideoIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-center">No videos available for this content.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 overflow-auto">
      <div className="p-4 border-b mb-4">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-sm text-gray-500">{videos.length} videos found</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id ? (typeof video.id === 'object' && 'videoId' in video.id ? video.id.videoId : video.id) : `video-${Math.random()}`}
            video={video}
            onPlay={onVideoSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoList;
