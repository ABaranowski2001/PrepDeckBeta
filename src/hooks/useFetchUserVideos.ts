import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFileState } from "@/contexts/ModuleContext";
import { Video } from "@/components/video/types";
import { safeJSONParse } from '@/utils/jsonUtil';
import { debugLog } from '@/utils/debugUtils';
import { testAdapter, USE_TEST_DATA_VIDEOS } from '@/utils/testAdapter';

// Video result interface for type safety
export interface UserVideosResult {
  videos: Video[];
  title: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook: Fetches videos for the current user and file from Supabase
 */
export const useFetchUserVideos = (): UserVideosResult => {
  const { user } = useAuth();
  const { currentFile } = useFileState();
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState<string>("Educational Videos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!user?.id || !currentFile?.name) {
          setIsLoading(false);
          return;
        }

        debugLog('info', 'useFetchUserVideos', 'Fetching videos', { 
          userId: user.id, 
          fileName: currentFile.name 
        });

        let data;
        let supabaseError = null;

        // Use test data or fetch from Supabase
        if (USE_TEST_DATA_VIDEOS) {
          debugLog('info', 'useFetchUserVideos', 'Using test data instead of Supabase');
          const testData = await testAdapter.getPDFVideoData();
          data = testData.data;
          supabaseError = testData.error;
        } else {
          // Actual Supabase call
          const { data: supabaseData, error: fetchError } = await supabase
            .from('PDF Video')
            .select('*')
            .eq('User_ID', user.id)
            .eq('File Name', currentFile.name);
          
          data = supabaseData;
          supabaseError = fetchError;
        }

        if (supabaseError) {
          setError(`Error fetching videos: ${supabaseError.message}`);
          setIsLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          debugLog('info', 'useFetchUserVideos', 'No videos found', { data });
          setVideos([]);
          setIsLoading(false);
          return;
        }

        // Get the videos from the first record
        const firstResult = data[0];
        
        // Get the Videos field which should contain the JSON
        const videosJson = firstResult.Video || '{}';
        
        // Parse the JSON data
        const { result: parsedVideos, error: parseError } = safeJSONParse(videosJson);
        
        if (parseError) {
          setError(`Error parsing videos data: ${parseError}`);
          setIsLoading(false);
          debugLog('error', 'useFetchUserVideos', 'Failed to parse videos JSON', { 
            error: parseError,
            rawData: videosJson 
          });
          return;
        }
        
        debugLog('info', 'useFetchUserVideos', `Parsed videos data type: ${typeof parsedVideos}`, { 
          isArray: Array.isArray(parsedVideos),
          isObject: typeof parsedVideos === 'object' && !Array.isArray(parsedVideos) 
        });

        let validVideos: Video[] = [];
        
        // Check if it's a flat array of video objects with videoId (new format)
        if (Array.isArray(parsedVideos) && parsedVideos.length > 0 && 'videoId' in parsedVideos[0]) {
          debugLog('info', 'useFetchUserVideos', 'Processing flat video array format', { 
            itemsCount: parsedVideos.length 
          });
          
          validVideos = parsedVideos
            .filter(item => 
              item && 
              item.videoId && 
              item.title
            )
            .map(item => ({
              id: item.videoId,
              title: item.title,
              description: item.description || '',
              url: item.videoUrl || `https://www.youtube.com/watch?v=${item.videoId}`,
              thumbnailUrl: item.thumbnail || '',
              embedUrl: `https://www.youtube.com/embed/${item.videoId}`,
              publishedAt: item.publishedAt,
              channelTitle: item.channelTitle
            }));
            
          setTitle('Educational Videos');
        }
        // If it's a YouTube API response, extract videos from the response
        else if (typeof parsedVideos === 'object' && !Array.isArray(parsedVideos) && 
                parsedVideos.items && Array.isArray(parsedVideos.items)) {
          debugLog('info', 'useFetchUserVideos', 'Processing YouTube API response', { 
            itemsCount: parsedVideos.items?.length 
          });
          
          validVideos = (parsedVideos.items || [])
            .filter(item => 
              item && 
              item.id && 
              item.id.videoId && 
              item.snippet && 
              item.snippet.title
            )
            .map(item => ({
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description || '',
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              thumbnailUrl: item.snippet.thumbnails?.high?.url || 
                         item.snippet.thumbnails?.medium?.url || 
                         item.snippet.thumbnails?.default?.url || '',
              embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
              publishedAt: item.snippet.publishedAt,
              channelTitle: item.snippet.channelTitle
            }));
            
          // Search query as title if available
          if (parsedVideos.q || firstResult.Search) {
            setTitle(`Videos about: ${parsedVideos.q || firstResult.Search || 'Your topic'}`);
          } else {
            setTitle('Educational Videos');
          }
        } else {
          // Handle other video data formats if needed
          debugLog('info', 'useFetchUserVideos', 'Unknown video data format', { 
            dataType: typeof parsedVideos 
          });
          validVideos = [];
          setTitle('Educational Videos');
        }
        
        debugLog('info', 'useFetchUserVideos', `Found ${validVideos.length} valid videos`);
        setVideos(validVideos);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        debugLog('error', 'useFetchUserVideos', 'Exception in fetch', { error: errorMessage });
        setError(`Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [user?.id, currentFile?.name]);

  // Log final videos data
  useEffect(() => {
    debugLog('info', 'useFetchUserVideos', `Setting ${videos.length} videos and title: "${title}"`);
  }, [videos, title]);

  console.log("useFetchUserVideos returning:", { 
    videosCount: videos.length, 
    title, 
    isLoading, 
    error 
  });
  
  return { videos, title, isLoading, error };
}; 