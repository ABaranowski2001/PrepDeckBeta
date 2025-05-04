
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFileState } from "@/contexts/ModuleContext";

// Card type interface for safety
export interface UserCard {
  question: string;
  answer: string;
}

export interface UserCardsResult {
  cards: UserCard[];
  title: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook: Fetches cards for the current user and file from Supabase
 */
export const useFetchUserCards = () : UserCardsResult => {
  const { user } = useAuth();
  const { currentFile } = useFileState();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [title, setTitle] = useState<string>("Memory Cards");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || !currentFile?.name) {
      console.log('Cards fetch aborted: Missing user ID or file name');
      setCards([]);
      setTitle("Memory Cards");
      setError(null);
      return;
    }
    
    console.log(`Fetching cards for user ${user.id} and file ${currentFile.name}`);
    setIsLoading(true);
    setError(null);

    const fetchCards = async () => {
      try {
        console.log('Starting Supabase query for cards...');
        const { data, error: fetchError } = await supabase
          .from("PDF Cards")
          .select("Cards")
          .eq("User_ID", user.id)
          .eq("File Name", currentFile.name);

        if (fetchError) {
          console.error("Error fetching cards:", fetchError);
          setError(fetchError.message || "Could not load card data.");
          setCards([]);
          setTitle("Memory Cards");
        } else if (data && data.length > 0) {
          console.log(`Found ${data.length} card entries, using the most recent one`);
          // Use the first entry (this will be the most recent if we add ordering in the future)
          const mostRecentEntry = data[0];
          
          if (mostRecentEntry.Cards) {
            console.log("Raw cards data received:", mostRecentEntry.Cards);
            
            // Handle markdown code block format that might be in the data
            let cardsText = mostRecentEntry.Cards;
            if (typeof cardsText === 'string') {
              // Remove markdown code block markers if present
              cardsText = cardsText.replace(/```json\s*|\s*```/g, '');
              console.log("Cleaned cards text:", cardsText);
            }
            
            // Cards can be an array, or an object with "cards" and "title"
            let parsed = null;
            try {
              parsed = typeof cardsText === "string" ? JSON.parse(cardsText) : cardsText;
              console.log("Parsed cards data:", parsed);
            } catch (e) {
              console.error("Error parsing cards data:", e);
              setError("Failed to parse card data.");
              setCards([]);
              setTitle("Memory Cards");
              setIsLoading(false);
              return;
            }

            let cardsArr: UserCard[] = [];
            let customTitle: string | undefined = undefined;

            if (Array.isArray(parsed)) {
              console.log("Cards data is an array with", parsed.length, "items");
              cardsArr = (parsed as UserCard[]).filter(card => card && card.question && card.answer);
            } else if (parsed && typeof parsed === "object") {
              console.log("Cards data is an object:", Object.keys(parsed));
              if (Array.isArray(parsed.cards)) {
                cardsArr = parsed.cards.filter(card => card && card.question && card.answer);
                customTitle = parsed.title;
                console.log(`Found object format with ${cardsArr.length} cards and title: ${customTitle}`);
              }
            }

            console.log(`Final cards array has ${cardsArr.length} items`);
            setCards(cardsArr);
            setTitle(customTitle || "Memory Cards");
            setError(null);
          } else {
            console.log("No cards data found in most recent entry");
            setCards([]);
            setTitle("Memory Cards");
          }
        } else {
          console.log("No cards data found in Supabase response");
          setCards([]);
          setTitle("Memory Cards");
        }
      } catch (e: any) {
        console.error("Exception in cards fetch:", e);
        setError(e?.message || "Failed to load cards.");
        setCards([]);
        setTitle("Memory Cards");
      }
      setIsLoading(false);
    };

    fetchCards();
  }, [user?.id, currentFile?.name]);

  return { cards, title, isLoading, error };
};
