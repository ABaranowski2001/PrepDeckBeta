import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVideosModule, useReadModule } from '@/contexts/ModuleContext';
import { toast } from 'sonner';

// Helper function to safely parse JSON
const safeJSONParse = (json: string, fallback: any = null) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return fallback;
  }
};

interface FetchPDFModulesResult {
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch PDF Video and PDF Read data from Supabase
 * based on user ID and filename
 */
export const useFetchPDFModules = (userId: string | undefined, fileName: string | undefined): FetchPDFModulesResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setVideos } = useVideosModule();
  const { setTexts } = useReadModule();

  const fetchData = async () => {
    if (!userId || !fileName) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch PDF Video data
      const { data: videoData, error: videoError } = await supabase
        .from('PDF Video')
        .select('Video')
        .eq('User_ID', userId)
        .eq('File Name', fileName);
      
      if (videoError) {
        console.error('Error fetching PDF Video data:', videoError);
      } else if (videoData && videoData.length > 0) {
        console.log('Found PDF Video data:', videoData);
        
        // Parse the video data
        let parsedVideos = safeJSONParse(videoData[0].Video, []);
        if (Array.isArray(parsedVideos)) {
          setVideos({ videos: parsedVideos, title: 'Educational Videos' });
        } else if (parsedVideos && Array.isArray(parsedVideos.videos)) {
          setVideos({ 
            videos: parsedVideos.videos, 
            title: parsedVideos.title || 'Educational Videos' 
          });
        } else {
          setVideos({ videos: [], title: 'Educational Videos' });
        }
      } else {
        console.log('No PDF Video data found for:', fileName);
        setVideos({ videos: [], title: 'Educational Videos' });
      }
      
      // Fetch PDF Read data
      const { data: readData, error: readError } = await supabase
        .from('PDF Read')
        .select('Read')
        .eq('User_ID', userId)
        .eq('File Name', fileName);
      
      if (readError) {
        console.error('Error fetching PDF Read data:', readError);
      } else if (readData && readData.length > 0) {
        console.log('Found PDF Read data:', readData);
        
        // Parse the read data
        try {
          const parsedRead = safeJSONParse(readData[0].Read, { texts: [] });
          if (Array.isArray(parsedRead)) {
            const validTexts = parsedRead.filter(item => 
              item && typeof item === 'object' && item.id && item.title);
            setTexts({ texts: validTexts, title: 'Academic Readings' });
          } else if (parsedRead && typeof parsedRead === 'object') {
            if (Array.isArray(parsedRead.texts)) {
              const validTexts = parsedRead.texts.filter(item => 
                item && typeof item === 'object' && item.id && item.title);
              setTexts({ 
                texts: validTexts, 
                title: parsedRead.title || 'Academic Readings' 
              });
            } else {
              setTexts({ texts: [], title: 'Academic Readings' });
            }
          } else {
            setTexts({ texts: [], title: 'Academic Readings' });
          }
        } catch (e) {
          console.error('Error parsing read data:', e);
          setTexts({ texts: [], title: 'Academic Readings' });
        }
      } else {
        console.log('No PDF Read data found for:', fileName);
        setTexts({ texts: [], title: 'Academic Readings' });
      }
    } catch (e) {
      console.error('Error fetching module data:', e);
      setError('Failed to load data from database');
      toast.error('Failed to load data', {
        description: 'There was a problem retrieving your data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or when userId/fileName changes
  useEffect(() => {
    fetchData();
  }, [userId, fileName]);

  // Return the loading state, error, and a function to refresh the data
  return {
    isLoading,
    error,
    refresh: fetchData
  };
}; 