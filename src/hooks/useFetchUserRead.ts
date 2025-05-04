import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFileState } from "@/contexts/ModuleContext";
import { Text } from "@/components/read/types";
import { safeJSONParse } from '@/utils/jsonUtil';
import { debugLog } from '@/utils/debugUtils';
import { testAdapter, USE_TEST_DATA_READS } from '@/utils/testAdapter';

// Read result interface for type safety
export interface UserReadResult {
  texts: Text[];
  title: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook: Fetches reading texts for the current user and file from Supabase
 */
export const useFetchUserRead = (): UserReadResult => {
  const { user } = useAuth();
  const { currentFile } = useFileState();
  const [texts, setTexts] = useState<Text[]>([]);
  const [title, setTitle] = useState<string>("Academic Readings");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRead = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!user?.id || !currentFile?.name) {
          setIsLoading(false);
          return;
        }

        debugLog('info', 'useFetchUserRead', 'Fetching reads', { 
          userId: user.id, 
          fileName: currentFile.name 
        });

        let data;
        let supabaseError = null;

        // Use test data or fetch from Supabase
        if (USE_TEST_DATA_READS) {
          debugLog('info', 'useFetchUserRead', 'Using test data instead of Supabase');
          const testData = await testAdapter.getPDFReadData();
          data = testData.data;
          supabaseError = testData.error;
        } else {
          // Actual Supabase call
          const { data: supabaseData, error: fetchError } = await supabase
            .from('PDF Read')
            .select('*')
            .eq('User_ID', user.id)
            .eq('File Name', currentFile.name);
          
          data = supabaseData;
          supabaseError = fetchError;
        }

        if (supabaseError) {
          setError(`Error fetching academic texts: ${supabaseError.message}`);
          setIsLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          debugLog('info', 'useFetchUserRead', 'No academic texts found', { data });
          setTexts([]);
          setIsLoading(false);
          return;
        }

        // Get the reads from the first record
        const firstResult = data[0];
        
        // Get the Reads field which should contain the JSON
        const readsJson = firstResult.Read || '{}';
        
        // Parse the JSON data
        const { result: parsedRead, error: parseError } = safeJSONParse(readsJson);
        
        if (parseError) {
          setError(`Error parsing academic texts data: ${parseError}`);
          setIsLoading(false);
          debugLog('error', 'useFetchUserRead', 'Failed to parse reads JSON', { 
            error: parseError,
            rawData: readsJson 
          });
          return;
        }
        
        debugLog('info', 'useFetchUserRead', `Parsed reads data type: ${typeof parsedRead}`, { 
          isArray: Array.isArray(parsedRead),
          isObject: typeof parsedRead === 'object' && !Array.isArray(parsedRead) 
        });

        let validTexts: Text[] = [];
        
        // Check for Google Scholar format (has organic_results)
        if (parsedRead && typeof parsedRead === 'object' && parsedRead.organic_results) {
          debugLog('info', 'useFetchUserRead', 'Processing Google Scholar format', { 
            resultCount: parsedRead.organic_results?.length 
          });
          
          validTexts = (parsedRead.organic_results || [])
            .filter(item => 
              item && 
              item.title && 
              (item.link || item.url)
            )
            .map(item => ({
              id: item.result_id || item.position?.toString() || `text-${Math.random().toString(36).substring(2, 9)}`,
              title: item.title,
              description: item.snippet || '',
              url: item.link || item.url || '',
              authors: item.publication_info?.authors || [],
              year: item.publication_info?.year || item.year || null,
              source: item.publication_info?.summary?.split('-')[0]?.trim() || 'Academic Source'
            }));
            
          // Set title based on search query if available
          if (parsedRead.search_metadata?.query || firstResult.Search) {
            setTitle(`Academic texts about: ${parsedRead.search_metadata?.query || firstResult.Search || 'your topic'}`);
          } else {
            setTitle('Academic Readings');
          }
        } 
        // Check for array of articles
        else if (Array.isArray(parsedRead)) {
          debugLog('info', 'useFetchUserRead', 'Processing array of articles', { 
            count: parsedRead.length 
          });
          
          validTexts = parsedRead
            .filter(item => 
              item && 
              typeof item === 'object' && 
              item.title && 
              (item.link || item.url)
            )
            .map(item => ({
              id: item.id || `text-${Math.random().toString(36).substring(2, 9)}`,
              title: item.title,
              description: item.description || item.snippet || '',
              url: item.url || item.link || '',
              authors: item.authors || [],
              year: item.year || null,
              source: item.source || 'Academic Source'
            }));
            
          setTitle('Academic Readings');
        }
        // Check if it's an object containing texts array
        else if (parsedRead && typeof parsedRead === 'object' && parsedRead.texts && Array.isArray(parsedRead.texts)) {
          debugLog('info', 'useFetchUserRead', 'Processing object with texts array', { 
            count: parsedRead.texts.length 
          });
          
          validTexts = parsedRead.texts
            .filter(item => 
              item && 
              typeof item === 'object' && 
              item.title && 
              (item.link || item.url)
            )
            .map(item => ({
              id: item.id || `text-${Math.random().toString(36).substring(2, 9)}`,
              title: item.title,
              description: item.description || item.snippet || '',
              url: item.url || item.link || '',
              authors: item.authors || [],
              year: item.year || null,
              source: item.source || 'Academic Source'
            }));
            
          setTitle(parsedRead.title || 'Academic Readings');
        }
        // Check for OpenAlex API format (has meta and results)
        else if (parsedRead && typeof parsedRead === 'object' && parsedRead.meta && Array.isArray(parsedRead.results)) {
          debugLog('info', 'useFetchUserRead', 'Processing OpenAlex API format', { 
            resultCount: parsedRead.results?.length 
          });
          
          validTexts = (parsedRead.results || [])
            .filter(item => 
              item && 
              item.id && 
              item.title
            )
            .map(item => {
              // Extract author names from authorships if available
              const authors = item.authorships?.map(authorship => 
                authorship.author?.display_name || authorship.raw_author_name
              ).filter(Boolean) || [];
              
              return {
                id: item.id,
                title: item.title,
                description: '',
                url: item.doi || item.id,
                authors: authors,
                year: item.publication_year?.toString() || null,
                source: 'OpenAlex'
              };
            });
            
          // Set title based on search query if available
          if (parsedRead.meta?.q) {
            setTitle(`Academic texts about: ${parsedRead.meta.q}`);
          } else {
            setTitle('Academic Readings');
          }
        } else {
          debugLog('info', 'useFetchUserRead', 'Unknown text data format', { 
            dataType: typeof parsedRead 
          });
          validTexts = [];
          setTitle('Academic Readings');
        }
        
        debugLog('info', 'useFetchUserRead', `Found ${validTexts.length} valid texts`);
        setTexts(validTexts);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        debugLog('error', 'useFetchUserRead', 'Exception in fetch', { error: errorMessage });
        setError(`Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRead();
  }, [user?.id, currentFile?.name]);

  // Log final texts data
  useEffect(() => {
    debugLog('info', 'useFetchUserRead', `Setting ${texts.length} texts and title: "${title}"`);
  }, [texts, title]);

  console.log("useFetchUserRead returning:", { 
    textsCount: texts.length, 
    title, 
    isLoading, 
    error 
  });
  
  return { texts, title, isLoading, error };
}; 