import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { useFileState, useSummaryModule, useCardsModule, useQuizModule, useVideosModule, useReadModule } from '@/contexts/ModuleContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Maximum time to wait for data (in milliseconds)
const MAX_WAIT_TIME = 300000; // 5 minutes
const POLLING_INTERVAL = 2000; // 2 seconds between checks

const LoadingPage = () => {
  const navigate = useNavigate();
  const { currentFile } = useFileState();
  const { setSummaryData } = useSummaryModule();
  const { setCards } = useCardsModule();
  const { setQuizData } = useQuizModule();
  const { setVideos } = useVideosModule();
  const { setTexts } = useReadModule();
  const { user } = useAuth();
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [modulesLoaded, setModulesLoaded] = useState({
    summary: false,
    cards: false,
    quiz: false,
    videos: false,
    read: false
  });
  const [isLoading, setIsLoading] = useState(true);

  // Function to safely parse JSON
  function safeJSONParse(json: string, fallback: any = null) {
    if (typeof json !== 'string') {
      console.warn('safeJSONParse received a non-string value:', json);
      return fallback;
    }
    try {
      return JSON.parse(json);
    } catch (error) {
      console.error('Error parsing JSON:', error, 'JSON string:', json);
      return fallback;
    }
  }

  function ensureArray(arr: any): any[] {
    return Array.isArray(arr) ? arr : [];
  }

  useEffect(() => {
    if (!currentFile || !user?.id) {
      toast.error("File information missing", { description: "Please upload a file first" });
      navigate('/upload');
      return;
    }

    const startTime = Date.now();
    let checkCount = 0;
    const fileName = currentFile.name;
    const userId = user.id;
    const isUrlContent = currentFile.type === 'text/plain' && fileName.startsWith('URL:');
    
    // Determine destination based on content type
    const resultsPage = isUrlContent ? '/url-results' : '/results';

    // Check for data availability across all modules
    const checkDataAvailability = async () => {
      checkCount++;
      const currentElapsed = Date.now() - startTime;
      setElapsedTime(currentElapsed);
      
      // If we've waited too long, redirect to results with whatever data we have
      if (currentElapsed > MAX_WAIT_TIME) {
        toast.warning("Processing taking longer than expected", { 
          description: "Showing available results. Some data may still be loading." 
        });
        navigate(resultsPage, { replace: true });
        return;
      }

      setStatusMessage(`Checking for processed data (Attempt ${checkCount})...`);
      let updatedModules = { ...modulesLoaded };
      let allLoaded = true;
      
      try {
        // Check Summary - use appropriate table based on content type
        if (!updatedModules.summary) {
          const summaryTable = isUrlContent ? 'URL Summary' : 'PDF Summary';
          const { data: summaryData } = await supabase
            .from(summaryTable)
            .select('Summary')
            .eq('User_ID', userId)
            .eq('File Name', fileName);

          if (summaryData && summaryData.length > 0 && summaryData[0].Summary) {
            setSummaryData({ processed: summaryData[0].Summary, original: null });
            updatedModules.summary = true;
            setStatusMessage("Summary data loaded!");
          } else {
            allLoaded = false;
          }
        }

        // Check Cards - use appropriate table based on content type
        if (!updatedModules.cards) {
          const cardsTable = isUrlContent ? 'URL Cards' : 'PDF Cards';
          const { data: cardsData } = await supabase
            .from(cardsTable)
            .select('Cards')
            .eq('User_ID', userId)
            .eq('File Name', fileName);

          if (cardsData && cardsData.length > 0 && cardsData[0].Cards) {
            try {
              let parsedCards = safeJSONParse(cardsData[0].Cards, []);
              if (Array.isArray(parsedCards)) {
                setCards(parsedCards);
              } else if (parsedCards && typeof parsedCards === 'object') {
                if (Array.isArray(parsedCards.cards)) {
                  setCards(parsedCards.cards);
                } else if (parsedCards.type === 'pdf_cards' && Array.isArray(parsedCards.cards)) {
                  setCards(parsedCards.cards);
                } else {
                  setCards([]);
                }
              } else {
                setCards([]);
              }
              updatedModules.cards = true;
              setStatusMessage("Flashcards loaded!");
            } catch (e) {
              console.error("Error processing cards data:", e);
            }
          } else {
            allLoaded = false;
          }
        }

        // Check Quiz - use appropriate table based on content type
        if (!updatedModules.quiz) {
          const quizTable = isUrlContent ? 'URL Quiz' : 'PDF Quiz';
          const { data: quizData } = await supabase
            .from(quizTable)
            .select('Quiz')
            .eq('User_ID', userId)
            .eq('File Name', fileName);

          if (quizData && quizData.length > 0 && quizData[0].Quiz) {
            let parsedQuiz = safeJSONParse(quizData[0].Quiz, []);
            if (Array.isArray(parsedQuiz)) {
              setQuizData({ questions: parsedQuiz, title: "Quiz" });
            } else if (parsedQuiz && Array.isArray(parsedQuiz.questions)) {
              setQuizData({ 
                questions: parsedQuiz.questions, 
                title: parsedQuiz.title || "Quiz" 
              });
            } else {
              setQuizData({ questions: [], title: "Quiz" });
            }
            updatedModules.quiz = true;
            setStatusMessage("Quiz questions loaded!");
          } else {
            allLoaded = false;
          }
        }

        // Check Videos - use appropriate table based on content type
        if (!updatedModules.videos) {
          const videoTable = isUrlContent ? 'URL Video' : 'PDF Video';
          const { data: videoData } = await supabase
            .from(videoTable)
            .select('Video')
            .eq('User_ID', userId)
            .eq('File Name', fileName);

          if (videoData && videoData.length > 0 && videoData[0].Video) {
            let parsedVideos = safeJSONParse(videoData[0].Video, []);
            if (Array.isArray(parsedVideos)) {
              setVideos({ videos: parsedVideos, title: "Educational Videos" });
            } else if (parsedVideos && Array.isArray(parsedVideos.videos)) {
              setVideos({ 
                videos: parsedVideos.videos, 
                title: parsedVideos.title || "Educational Videos" 
              });
            } else {
              setVideos({ videos: [], title: "Educational Videos" });
            }
            updatedModules.videos = true;
            setStatusMessage("Related videos loaded!");
          } else {
            allLoaded = false;
          }
        }

        // Check Read - use appropriate table based on content type
        if (!updatedModules.read) {
          const readTable = isUrlContent ? 'URL Read' : 'PDF Read';
          const { data: readData } = await supabase
            .from(readTable)
            .select('Read')
            .eq('User_ID', userId)
            .eq('File Name', fileName);

          if (readData && readData.length > 0 && readData[0].Read) {
            try {
              const parsedRead = safeJSONParse(readData[0].Read, {texts: []});
              if (Array.isArray(parsedRead)) {
                setTexts({
                  texts: parsedRead.filter(item => 
                    item && typeof item === 'object' && item.id && item.title),
                  title: "Academic Readings"
                });
              } else if (parsedRead && typeof parsedRead === 'object') {
                if (Array.isArray(parsedRead.texts)) {
                  setTexts({
                    texts: parsedRead.texts.filter(item => 
                      item && typeof item === 'object' && item.id && item.title),
                    title: parsedRead.title || "Academic Readings"
                  });
                } else {
                  setTexts({ texts: [], title: "Academic Readings" });
                }
              } else {
                setTexts({ texts: [], title: "Academic Readings" });
              }
              updatedModules.read = true;
              setStatusMessage("Academic readings loaded!");
            } catch (e) {
              console.error("Error parsing read data:", e);
            }
          } else {
            allLoaded = false;
          }
        }

        setModulesLoaded(updatedModules);
        
        // Count loaded modules for progress bar
        const loadedCount = Object.values(updatedModules).filter(Boolean).length;
        const totalModules = Object.keys(updatedModules).length;
        const newProgress = Math.round((loadedCount / totalModules) * 100);
        setProgress(newProgress);

        // Decide what to do based on data availability
        if (allLoaded) {
          // All modules loaded successfully
          toast.success("Processing complete!", { description: "All data loaded successfully" });
          navigate(resultsPage, { replace: true });
        } else if (updatedModules.summary) {
          // At least summary is available, we can show results
          if (checkCount >= 10) {
            toast.success("Basic processing complete", { 
              description: "Summary available, other features may still be loading" 
            });
            navigate(resultsPage, { replace: true });
          } else {
            // Keep waiting for more data
            setTimeout(checkDataAvailability, POLLING_INTERVAL);
          }
        } else {
          // No data yet, continue polling
          setTimeout(checkDataAvailability, POLLING_INTERVAL);
        }
      } catch (error) {
        console.error("Error checking data availability:", error);
        setStatusMessage("Error checking data. Retrying...");
        setTimeout(checkDataAvailability, POLLING_INTERVAL);
      }
    };

    // Start the polling process
    checkDataAvailability();
    
    // Cleanup
    return () => {
      // Nothing to clean up
    };
  }, []);

  // Format elapsed time in minutes and seconds
  const formatElapsedTime = () => {
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getStatusEmoji = () => {
    const loadedCount = Object.values(modulesLoaded).filter(Boolean).length;
    if (loadedCount === 0) return "🔍";
    if (loadedCount < 3) return "🔄";
    if (loadedCount < 5) return "📊";
    return "🎉";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow gradient-bg pt-20 flex items-center justify-center">
        <div className="apple-card p-8 text-center space-y-6 max-w-lg w-full">
          <Loader2 className="h-16 w-16 mx-auto text-blue-500 mb-6 animate-spin" />
          <h2 className="text-2xl font-bold">Processing Your Content</h2>
          
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
            </div>
          </div>

          <div className="space-y-2 text-left text-sm">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${modulesLoaded.summary ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={modulesLoaded.summary ? 'text-gray-900' : 'text-gray-500'}>Summary</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${modulesLoaded.cards ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={modulesLoaded.cards ? 'text-gray-900' : 'text-gray-500'}>Flashcards</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${modulesLoaded.quiz ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={modulesLoaded.quiz ? 'text-gray-900' : 'text-gray-500'}>Quiz Questions</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${modulesLoaded.videos ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={modulesLoaded.videos ? 'text-gray-900' : 'text-gray-500'}>Related Videos</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${modulesLoaded.read ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={modulesLoaded.read ? 'text-gray-900' : 'text-gray-500'}>Academic Readings</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingPage; 