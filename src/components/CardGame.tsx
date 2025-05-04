import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface CardGameProps {
  cards: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
}

const CardGame = ({ cards, title = "Memory Cards" }: CardGameProps) => {
  // Log cards to verify count
  console.log(`CardGame component received ${cards.length} cards`);
  
  // Track the current card index and deck state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  // Track all available card indices in a reliable way
  const [deck, setDeck] = useState<number[]>(() => 
    Array.from({ length: cards.length }, (_, i) => i)
  );
  
  // Track position in the deck for progress display
  const [position, setPosition] = useState(1);

  // Current card is always reliably determined from deck and currentIndex
  const currentCard = cards[deck[currentIndex]];

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    // If we're at the end of the deck, reset
    if (currentIndex >= deck.length - 1) {
      setPosition(1);
      setCurrentIndex(0);
    } else {
      // Otherwise move to next card
      setCurrentIndex(currentIndex + 1);
      setPosition(position + 1);
    }
    setFlipped(false);
  };

  const handleShuffle = () => {
    // Create a new shuffled deck
    const newDeck = [...Array(cards.length).keys()];
    
    // Fisher-Yates shuffle algorithm
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    setDeck(newDeck);
    setCurrentIndex(0);
    setPosition(1);
    setFlipped(false);
    
    toast.success("Cards shuffled");
  };

  const handleDownload = () => {
    if (!cards || cards.length === 0) return;
    
    // Format cards data as text
    const cardsText = cards.map((card, index) => {
      return `Card ${index + 1}\n---------\nQuestion: ${card.question}\nAnswer: ${card.answer}\n\n`;
    }).join('');
    
    const fileContent = `${title}\n\n${cardsText}`;
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    
    // Create a blob with the content
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success(`Cards downloaded as ${fileName}`);
  };

  if (!cards || cards.length === 0) {
    return (
      <Card className="w-full h-full shadow-sm border border-gray-200 overflow-hidden">
        <CardContent className="flex items-center justify-center p-12 text-gray-500">
          No cards were generated for this content.
        </CardContent>
      </Card>
    );
  }

  // Calculate progress as a percentage of current position out of total cards
  const progressPercentage = (position / deck.length) * 100;

  return (
    <Card className="w-full h-full flex flex-col shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
        <span>Card {position} of {deck.length}</span>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShuffle} 
            aria-label="Shuffle cards"
            title="Shuffle cards"
            className="h-7 w-7"
          >
            <Shuffle className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDownload} 
            aria-label="Download cards"
            title="Download cards"
            className="h-7 w-7"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-1 w-full rounded-none" />

      <CardContent className="flex-grow p-3 flex flex-col overflow-auto">
        <div 
          className={`relative w-full flex-grow cursor-pointer transition-all duration-300 transform perspective-1000`}
          onClick={handleFlip}
        >
          <div className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
            {/* Front side (Question) */}
            <div className={`absolute inset-0 p-6 flex items-center justify-center backface-hidden rounded-md border ${flipped ? 'invisible' : 'border-gray-200 bg-white'}`}>
              <div className="text-center">
                <p className="font-medium text-base">{currentCard.question}</p>
              </div>
            </div>
            
            {/* Back side (Answer) */}
            <div className={`absolute inset-0 p-6 flex items-center justify-center backface-hidden rounded-md rotate-y-180 ${!flipped ? 'invisible' : 'border-blue-200 bg-blue-50'}`}>
              <div className="text-center">
                <p className="font-medium text-base">{currentCard.answer}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-3 mt-auto">
          <Button 
            onClick={handleFlip} 
            size="sm"
          >
            {flipped ? 'Show Question' : 'Show Answer'}
          </Button>
          <Button 
            onClick={handleNext}
            size="sm"
          >
            Next Card
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardGame;
