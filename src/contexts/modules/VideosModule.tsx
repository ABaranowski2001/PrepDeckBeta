
import { useState } from 'react';
import { BaseModuleState, createBaseModuleState } from './BaseModuleState';

// Videos module state interface
export interface VideosModuleState extends BaseModuleState {
  videos: any[] | null;
  title: string;
  setVideos: (data: { videos: any[] | null; title?: string }) => void;
}

// Create videos module state
export const createVideosModule = (): VideosModuleState => {
  const baseState = createBaseModuleState();
  const [videos, setVideos] = useState<any[] | null>(null);
  const [title, setTitle] = useState<string>('Educational Videos');
  
  return {
    ...baseState,
    videos,
    title,
    setVideos: (data: { videos: any[] | null; title?: string }) => {
      setVideos(data.videos);
      if (data.title) setTitle(data.title);
    },
    reset: () => {
      baseState.reset();
      setVideos(null);
      setTitle('Educational Videos');
    }
  };
};
