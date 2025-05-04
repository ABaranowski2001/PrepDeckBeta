
import { Text } from './types';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface ReadDescriptionProps {
  text: Text;
  onBack: () => void;
}

const ReadDescription = ({ text, onBack }: ReadDescriptionProps) => {
  const handleReadNow = () => {
    // Determine the URL - prefer DOI if available, otherwise fallback to regular URL
    let articleUrl = text.url;
    
    if (text.doi && !articleUrl) {
      // Format DOI as URL if needed
      if (!text.doi.startsWith('http')) {
        const cleanedDoi = text.doi.startsWith('doi:') ? text.doi.substring(4) : text.doi;
        articleUrl = `https://doi.org/${cleanedDoi}`;
      } else {
        articleUrl = text.doi;
      }
    }
    
    if (articleUrl) {
      try {
        window.open(articleUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error("Failed to open URL:", error);
        toast.error("Failed to open the article. The URL may be invalid.");
      }
    } else {
      toast.info("No URL available for this article.");
    }
  };

  console.log("ReadDescription rendering with text:", text);

  return (
    <div className="h-full flex flex-col overflow-auto p-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="self-start mb-4 flex items-center" 
        onClick={() => {
          console.log("Back button clicked in ReadDescription");
          onBack();
        }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to list
      </Button>
      
      <div className="flex flex-col md:flex-row gap-6">
        {text.thumbnail ? (
          <div className="md:w-1/3 lg:w-1/4">
            <div className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={text.thumbnail} 
                alt={text.title} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        ) : (
          <div className="md:w-1/3 lg:w-1/4">
            <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">{text.title}</h2>
          
          {text.author && (
            <p className="text-gray-600 mb-2">
              By {text.author}{text.year ? ` (${text.year})` : ''}
            </p>
          )}
          
          {text.type && (
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {text.type.charAt(0).toUpperCase() + text.type.slice(1)}
              </span>
            </div>
          )}
          
          {text.doi && (
            <div className="mb-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                DOI: {text.doi}
              </span>
            </div>
          )}
          
          {text.tags && text.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {text.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {text.description && (
            <div className="my-4 text-gray-700">
              <p className="whitespace-pre-line">{text.description}</p>
            </div>
          )}
          
          <Button 
            className="mt-4"
            onClick={handleReadNow}
            disabled={!text.url && !text.doi}
          >
            Read Now
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReadDescription;
