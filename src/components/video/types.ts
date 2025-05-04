export interface Video {
  id: string | { videoId: string } | null;
  title: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnail?: string; // For backward compatibility
  embedUrl?: string;
  publishedAt?: string;
  channelTitle?: string;
}

export interface VideosProps {
  title?: string;
  videos?: Video[];
  activeVideo?: Video | null;
  onVideoChange?: (video: Video | null) => void;
  isTabActive?: boolean;
}
