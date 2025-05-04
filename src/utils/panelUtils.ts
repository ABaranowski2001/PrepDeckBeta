
/**
 * Determines if content is available and processes data
 */
export const determineContentAvailability = (data: any) => {
  if (!data) return { hasContent: false, processedData: null };
  
  // Simplified data processing
  const processedData = Array.isArray(data) 
    ? data 
    : data?.texts || data?.videos || data?.cards || [];
  
  return { 
    hasContent: processedData.length > 0, 
    processedData 
  };
};

/**
 * Generates panel title with better fallback
 */
export const generatePanelTitle = (data: any, defaultTitle: string = "Content") => {
  return data?.title || defaultTitle;
};
