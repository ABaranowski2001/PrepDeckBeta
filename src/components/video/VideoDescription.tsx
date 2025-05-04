
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface VideoDescriptionProps {
  description: string | undefined;
}

const VideoDescription = ({ description }: VideoDescriptionProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  if (!description) {
    return null;
  }

  return (
    <Collapsible 
      open={showFullDescription} 
      onOpenChange={setShowFullDescription}
      className="mt-2"
    >
      <div className={`text-gray-600 ${!showFullDescription && "line-clamp-3"}`}>
        {description}
      </div>
      
      {description.length > 140 && (
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2 py-1 h-auto mt-1 text-xs flex items-center"
          >
            {showFullDescription ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                See less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                See more
              </>
            )}
          </Button>
        </CollapsibleTrigger>
      )}
      
      <CollapsibleContent>
        <ScrollArea className="max-h-36 mt-2">
          <div className="text-gray-600">
            {description}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default VideoDescription;
