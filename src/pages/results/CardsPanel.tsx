
import { PlusCircle } from 'lucide-react';
import CardGame from '@/components/CardGame';
import PanelContainer from '@/components/panels/PanelContainer';
import { useFetchUserCards } from '@/hooks/useFetchUserCards';
import { useEffect } from 'react';

interface CardsPanelProps {
  isTabActive?: boolean;
}

/**
 * Now pulls real card data for the current user/file!
 */
const CardsPanel = ({ isTabActive }: CardsPanelProps) => {
  const { cards, title, isLoading, error } = useFetchUserCards();
  const hasCards = cards.length > 0;

  useEffect(() => {
    console.log("CardsPanel render state:", { 
      hasCards, 
      cardsCount: cards.length, 
      title, 
      isLoading, 
      error,
      isTabActive
    });
    
    if (cards.length > 0) {
      console.log("First card sample:", cards[0]);
    }
  }, [cards, title, isLoading, error, isTabActive]);

  return (
    <PanelContainer
      isPending={isLoading}
      loadingTitle="Loading memory cards"
      loadingDescription="Retrieving your cards from storage..."
      icon={!hasCards && <PlusCircle className="h-12 w-12 text-gray-400" />}
      emptyTitle={!hasCards && !error ? "No cards available for this content." : undefined}
      error={error}
    >
      {hasCards && <CardGame cards={cards} title={title} />}
    </PanelContainer>
  );
};

export default CardsPanel;
