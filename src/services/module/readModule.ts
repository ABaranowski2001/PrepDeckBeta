
import { Text } from '@/components/read/types';

// Read module handler
export const callReadWebhook = async (
  file: File, 
  setIsLoading: (loading: boolean) => void, 
  setError: (error: string | null) => void
): Promise<{ texts: Text[] | null, title: string } | null> => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Return sample data for testing
    const sampleTexts: Text[] = [
      {
        id: "text1",
        title: "Climate Change and Global Impact",
        author: "Dr. Emma Johnson",
        year: "2023",
        type: "paper",
        description: "A comprehensive analysis of climate change effects on global ecosystems and economies.",
        thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "text2",
        title: "Advances in Quantum Computing",
        author: "Dr. Michael Chen",
        year: "2024",
        type: "paper",
        description: "Recent breakthroughs in quantum computing algorithms and applications.",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "text3",
        title: "The History and Future of Artificial Intelligence",
        author: "Prof. Sarah Williams",
        year: "2023",
        type: "book",
        description: "A historical perspective on AI development and predictions for its future trajectory.",
        thumbnail: "https://images.unsplash.com/photo-1529453355772-03f980581b95?auto=format&fit=crop&w=300&q=80"
      }
    ];
    
    return { 
      texts: sampleTexts, 
      title: "Academic Readings" 
    };
  } catch (error) {
    console.error("Error in read webhook:", error);
    setError("Error loading reading materials");
    return { texts: [], title: "Academic Readings" };
  } finally {
    setIsLoading(false);
  }
};
