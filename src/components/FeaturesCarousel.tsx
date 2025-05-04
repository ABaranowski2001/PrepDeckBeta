
import React, { useCallback, useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { BrainCircuit, FileText, ListChecks, Repeat, Upload, Globe, FileText as TextSummary } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
};

const FeatureCard = ({ icon, title, description, bgColor, iconColor }: FeatureCardProps) => (
  <div className={`p-8 md:p-10 h-full rounded-3xl transition-all duration-300 ${bgColor}`}>
    <div className="flex flex-col h-full">
      <h3 className="text-2xl md:text-3xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-8">{description}</p>
      <div className={`mt-auto self-center ${iconColor} w-24 h-24 flex items-center justify-center rounded-2xl shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

const FeaturesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    loop: true,
    dragFree: true
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const features = [
    {
      icon: <TextSummary className="h-12 w-12 text-white" />,
      title: "Text Summaries",
      description: "Convert dense document content into concise, easy-to-understand summaries that highlight key concepts.",
      bgColor: "bg-white",
      iconColor: "bg-teal-500"
    },
    {
      icon: <BrainCircuit className="h-12 w-12 text-white" />,
      title: "AI-Powered Analysis",
      description: "Our advanced AI understands context, extracts key information, and generates learning materials instantly.",
      bgColor: "bg-white",
      iconColor: "bg-blue-500"
    },
    {
      icon: <FileText className="h-12 w-12 text-white" />,
      title: "Smart Cue Cards",
      description: "Automatically generate flashcards from notes, transcripts, or uploads — perfect for bite-sized revision.",
      bgColor: "bg-white",
      iconColor: "bg-red-500"
    },
    {
      icon: <ListChecks className="h-12 w-12 text-white" />,
      title: "Multiple Choice Generator",
      description: "Turn raw content into high-quality multiple-choice questions with explanations, ready for quizzes and practice.",
      bgColor: "bg-white",
      iconColor: "bg-purple-500"
    },
    {
      icon: <Repeat className="h-12 w-12 text-white" />,
      title: "Interactive Learning Loops",
      description: "Engage with your content through smart repetition — flip, test, and reinforce understanding with every scroll.",
      bgColor: "bg-white",
      iconColor: "bg-green-500"
    },
    {
      icon: <Upload className="h-12 w-12 text-white" />,
      title: "Upload & Go",
      description: "Drop in your files (PDFs, Word docs, transcripts) and get instant, structured study tools — no formatting needed.",
      bgColor: "bg-white",
      iconColor: "bg-amber-500"
    },
    {
      icon: <Globe className="h-12 w-12 text-white" />,
      title: "Access Anywhere",
      description: "StudyDeck works across devices, so learners can revise on desktop, tablet, or mobile — whenever inspiration hits.",
      bgColor: "bg-white",
      iconColor: "bg-teal-500"
    }
  ];

  return (
    <div className="py-8">
      <div 
        className="overflow-hidden" 
        ref={emblaRef}
      >
        <div className="flex -ml-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="pl-4 min-w-0 shrink-0 grow-0 md:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full">
                <FeatureCard {...feature} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center mt-6 gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === selectedIndex ? 'active' : ''}`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesCarousel;
