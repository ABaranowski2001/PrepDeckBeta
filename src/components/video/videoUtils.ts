import { Video } from './types';

/**
 * Extracts YouTube video ID from various URL formats
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  console.log("Getting YouTube ID from URL:", url);
  
  // Regular expression to match YouTube video ID in various URL formats
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    console.log("Extracted YouTube ID:", match[1]);
    return match[1];
  }
  
  // Check if it's possibly just the ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    console.log("URL appears to be a direct YouTube ID:", url);
    return url;
  }
  
  console.log("Could not extract YouTube ID from URL");
  return null;
}

/**
 * Converts a regular video URL to an embeddable URL
 */
export function getVideoEmbedUrl(url: string): string {
  if (!url) return '';
  
  console.log("Converting URL to embed format:", url);
  
  // Handle YouTube URLs
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  }
  
  // Return the URL as is if it already looks like an embed URL
  if (url.includes('/embed/') || url.includes('player.vimeo.com')) {
    console.log("URL appears to already be an embed URL");
    return url;
  }
  
  // Handle Vimeo URLs
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    console.log("Extracted Vimeo ID:", vimeoMatch[1]);
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  
  // If we couldn't identify a known video service, return the original URL
  console.log("Using original URL as embed URL");
  return url;
}

/**
 * Checks if a URL is a valid video URL
 */
export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;
  
  // Check for common video services
  const videoPatterns = [
    /youtube\.com/,
    /youtu\.be/,
    /vimeo\.com/,
    /\.(mp4|webm|ogg)$/,
    /^[a-zA-Z0-9_-]{11}$/, // YouTube ID format
    /player\.vimeo\.com/,
    /embed\//
  ];
  
  return videoPatterns.some(pattern => pattern.test(url));
}

/**
 * Gets a thumbnail URL from a video URL
 */
export function getVideoThumbnail(url: string): string {
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  
  // Default placeholder
  return 'https://via.placeholder.com/480x360?text=Video';
}

export const getVideoId = (video: Video): string => {
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
