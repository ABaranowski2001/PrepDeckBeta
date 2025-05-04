
import { PlusCircle } from 'lucide-react';
import CardGame from '@/components/CardGame';
import PanelContainer from '@/components/panels/PanelContainer';

interface CardGamePanelProps {
  cardGameData: any;
  isPending?: boolean;
}

const CardGamePanel = ({ cardGameData, isPending }: CardGamePanelProps) => {
  const cards = [];
  let gameTitle = "Memory Cards";
  
  if (cardGameData) {
    // Clear approach to extract exactly the cards from webhook
    if (cardGameData.cards && Array.isArray(cardGameData.cards)) {
      // If it's an object with a cards array property
      cards.push(...cardGameData.cards);
      console.log(`Found ${cards.length} cards in cardGameData.cards`);
    } else if (Array.isArray(cardGameData)) {
      // If it's directly an array of cards
      cards.push(...cardGameData);
      console.log(`Found ${cards.length} cards in cardGameData array`);
    }
    
    if (cardGameData.title) {
      gameTitle = cardGameData.title;
    }
  }

  const hasCards = cards.length > 0;

  return (
    <PanelContainer
      isPending={isPending || false}
      loadingTitle="Creating memory cards"
      loadingDescription="We're generating memory cards based on your content."
      icon={!hasCards && <PlusCircle className="h-12 w-12 text-gray-400" />}
      emptyTitle={!hasCards ? "No cards available for this content." : undefined}
      debugData={!hasCards ? cardGameData : undefined}
    >
      {hasCards && <CardGame cards={cards} title={gameTitle} />}
    </PanelContainer>
  );
};

export default CardGamePanel;
