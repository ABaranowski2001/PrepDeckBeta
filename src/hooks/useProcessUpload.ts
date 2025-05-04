import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFileState } from '@/contexts/ModuleContext';
import { useSummaryModule, useCardsModule, useQuizModule, useVideosModule, useReadModule } from '@/contexts/ModuleContext';
import { PDF_WEBHOOKS } from '@/services/module/webhookUrls';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Text } from '@/components/read/types';

export const useProcessUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { setCurrentFile } = useFileState();
  const { setSummaryData } = useSummaryModule();
  const { setCards } = useCardsModule();
  const { setQuizData } = useQuizModule();
  const { setVideos } = useVideosModule();
  const { setTexts } = useReadModule();
  const { user } = useAuth();

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

  const fetchExistingModuleData = async (userId: string, fileName: string) => {
    let found = false;
    const data: Record<string, any> = {};

    const { data: summaryData } = await supabase
      .from('PDF Summary')
      .select('Summary')
      .eq('User_ID', userId)
      .eq('File Name', fileName);

    if (summaryData && summaryData.length > 0) {
      found = true;
      data.summary = summaryData[0].Summary;
    }

    const { data: cardsData, error: cardsError } = await supabase
      .from('PDF Cards')
      .select('Cards')
      .eq('User_ID', userId)
      .eq('File Name', fileName);

    if (cardsError) {
      console.error("Error fetching cards data:", cardsError);
    }

    if (cardsData && cardsData.length > 0) {
      console.log("Raw cards data from Supabase:", cardsData[0].Cards);
      found = true;
      try {
        let parsedCards = safeJSONParse(cardsData[0].Cards, []);
        console.log("Parsed cards data:", parsedCards);

        if (Array.isArray(parsedCards)) {
          data.cards = parsedCards;
        } else if (parsedCards && typeof parsedCards === 'object') {
          if (Array.isArray(parsedCards.cards)) {
            data.cards = parsedCards.cards;
            if (parsedCards.title) data.cardsTitle = parsedCards.title;
          } else if (parsedCards.type === 'pdf_cards' && Array.isArray(parsedCards.cards)) {
            data.cards = parsedCards.cards;
            if (parsedCards.title) data.cardsTitle = parsedCards.title;
          }
        } else {
          data.cards = [];
          console.error("Cards data is not in an expected format:", parsedCards);
        }
      } catch (e) {
        console.error("Error processing cards data:", e);
        data.cards = [];
      }
    }

    const { data: quizData } = await supabase
      .from('PDF Quiz')
      .select('Quiz')
      .eq('User_ID', userId)
      .eq('File Name', fileName);

    if (quizData && quizData.length > 0) {
      found = true;
      let parsedQuiz = safeJSONParse(quizData[0].Quiz, []);
      if (Array.isArray(parsedQuiz)) {
        data.quiz = parsedQuiz;
      } else if (parsedQuiz && Array.isArray(parsedQuiz.questions)) {
        data.quiz = parsedQuiz.questions;
        if (parsedQuiz.title) data.quizTitle = parsedQuiz.title;
      } else {
        data.quiz = [];
      }
    }

    const { data: videoData } = await supabase
      .from('PDF Video')
      .select('Video')
      .eq('User_ID', userId)
      .eq('File Name', fileName);

    if (videoData && videoData.length > 0) {
      found = true;
      let parsedVideos = safeJSONParse(videoData[0].Video, []);
      if (Array.isArray(parsedVideos)) {
        data.videos = parsedVideos;
      } else if (parsedVideos && Array.isArray(parsedVideos.videos)) {
        data.videos = parsedVideos.videos;
        if (parsedVideos.title) data.videosTitle = parsedVideos.title;
      } else {
        data.videos = [];
      }
    }

    const { data: readData } = await supabase
      .from('PDF Read')
      .select('Read')
      .eq('User_ID', userId)
      .eq('File Name', fileName);

    if (readData && readData.length > 0) {
      found = true;
      try {
        const parsedRead = safeJSONParse(readData[0].Read, {texts: []});
        if (Array.isArray(parsedRead)) {
          data.texts = parsedRead.filter(item => 
            item && typeof item === 'object' && item.id && item.title);
          data.readTitle = "Academic Readings";
        } else if (parsedRead && typeof parsedRead === 'object') {
          if (Array.isArray(parsedRead.texts)) {
            data.texts = parsedRead.texts.filter(item => 
              item && typeof item === 'object' && item.id && item.title);
          } else {
            data.texts = [];
          }
          data.readTitle = parsedRead.title || "Academic Readings";
        } else {
          data.texts = [];
          data.readTitle = "Academic Readings";
        }
      } catch (e) {
        console.error("Error parsing read data:", e);
        data.texts = [];
        data.readTitle = "Academic Readings";
      }
    }

    return { found, data };
  };

  // Efficient file sending to all active webhooks (joint primarys)
  const sendFileToWebhooks = async (file: File, webhookUrls: string[], userId: string) => {
    console.log(`[Webhook] Sending file to ${webhookUrls.length} webhooks:`, webhookUrls);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('filetype', file.type);
    formData.append('filesize', file.size.toString());
    if (userId) formData.append('user_id', userId);
    formData.append('timestamp', new Date().toISOString());

    return Promise.all(webhookUrls.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          cache: 'no-store'
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[Webhook] ${url} failed:`, errorText);
          return { url, success: false, error: `Status: ${response.status}` };
        }
        const responseText = await response.text();
        return { url, success: true, response: responseText };
      } catch (error: any) {
        console.warn(`[Webhook] Failed to send to ${url}:`, error);
        return { url, success: false, error: error.message || String(error) };
      }
    }));
  };

  const handleSubmit = async (file: File | null) => {
    if (!file) {
      toast.error("No file selected", { description: "Please upload a file first" });
      return;
    }

    try {
      setIsProcessing(true);
      setCurrentFile(file);
      const userId = user?.id || 'anonymous';
      const fileName = file.name;

      const { found, data: existingData } = await fetchExistingModuleData(userId, fileName);

      if (found) {
        toast.success("File previously processed", { description: "Loaded your previous results from database." });
        if (existingData.summary !== undefined) {
          setSummaryData({ processed: existingData.summary, original: null });
        }
        if (existingData.cards !== undefined) {
          setCards(Array.isArray(existingData.cards) ? existingData.cards : []);
        } else setCards([]);
        if (existingData.quiz !== undefined) {
          setQuizData({ questions: ensureArray(existingData.quiz), title: existingData.quizTitle || "Quiz" });
        } else setQuizData({ questions: [], title: "Quiz" });
        if (existingData.videos !== undefined) {
          setVideos({ videos: ensureArray(existingData.videos), title: existingData.videosTitle || "Educational Videos" });
        } else setVideos({ videos: [], title: "Educational Videos" });
        if (existingData.texts !== undefined) {
          let textsArray = ensureArray(existingData.texts)
            .filter(text => text && typeof text === 'object' && text.id && text.title);
          setTexts({ texts: textsArray, title: existingData.readTitle || "Academic Texts" });
        } else setTexts({ texts: [], title: "Academic Texts" });

        navigate('/loading', { replace: true });
        return;
      }

      toast("Processing uploaded file...", { description: "Sending PDF directly to Make.com webhooks..." });

      try {
        const webhookResults = await sendFileToWebhooks(file, PDF_WEBHOOKS, userId);
        const successCount = webhookResults.filter(r => r.success).length;
        const failedCount = webhookResults.length - successCount;
        if (successCount > 0) {
          toast.success("File sent to webhooks", {
            description: `Successfully sent to ${successCount} webhooks, ${failedCount} failed`
          });
        } else {
          toast.error("Webhook processing failed", {
            description: "All webhook calls failed. Please try again later."
          });
        }
      } catch (error: any) {
        toast.error("Webhook Error", { description: error.message || "Error calling webhooks" });
      }

      setSummaryData({ processed: "Your file was sent directly to all webhooks. Check the results in each tab.", original: null });
      setCards([]);
      setQuizData({ questions: [], title: "Quiz" });
      setVideos({ videos: [], title: "Educational Videos" });
      setTexts({ texts: [], title: "Academic Texts" });
      navigate('/loading', { replace: true });

    } catch (error) {
      toast.error("Processing Error", { description: "There was a problem processing your file" });
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, handleSubmit };
};
