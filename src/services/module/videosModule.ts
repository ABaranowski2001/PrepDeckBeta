
// Videos module handler
export const callVideosWebhook = async (
  file: File, 
  setIsLoading: (loading: boolean) => void, 
  setError: (error: string | null) => void
): Promise<{ videos: any[] | null, title: string } | null> => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Return sample data for testing
    const sampleVideos = [
      {
        id: "vid1",
        title: "Introduction to Climate Change",
        description: "Learn about the basics of climate change and its global impact.",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        duration: "10:15"
      },
      {
        id: "vid2",
        title: "Understanding Quantum Physics",
        description: "A simple explanation of complex quantum physics concepts.",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        duration: "15:42"
      },
      {
        id: "vid3",
        title: "The History of Ancient Rome",
        description: "Explore the rise and fall of the Roman Empire.",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        duration: "20:30"
      }
    ];
    
    return { videos: sampleVideos, title: "Educational Videos" };
  } catch (error) {
    console.error("Error in videos webhook:", error);
    setError("Error loading video recommendations");
    return { videos: [], title: "Educational Videos" };
  } finally {
    setIsLoading(false);
  }
};
