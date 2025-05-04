import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const { user } = useAuth();
  
  // Function to handle smooth scrolling to a section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-20">
      <div className="gradient-bg min-h-[90vh] flex items-center overflow-hidden">
        <div className="section-container py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 apple-appear">
              <h1 className="apple-headline">
                PrepDeck
              </h1>
              <p className="apple-subheadline apple-appear apple-appear-delay-1 max-w-xl">
                From flat to functional — reimagine your files<br />
                Learn faster, study smarter.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 apple-appear apple-appear-delay-2">
                <Button 
                  asChild 
                  className="rounded-full bg-apple-blue hover:bg-blue-600 text-white px-8 py-3 h-12 text-base font-medium transition-all duration-300"
                >
                  <Link to={user ? "/dashboard" : "/upload"} className="flex items-center gap-2">
                    {user ? "My Documents" : "Try Now"} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 px-8 py-3 h-12 text-base font-medium transition-all duration-300"
                  onClick={() => scrollToSection('features')}
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative apple-appear apple-appear-delay-1">
              <div className="apple-card aspect-[4/3] shadow-lg overflow-hidden relative animate-apple-float">
                <div className="absolute inset-0">
                  <div className="h-full w-full bg-gradient-to-tr from-blue-100 to-gray-100"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-10 border border-gray-100">
                    <div className="p-6">
                      <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-xs text-gray-500">
                        Document Page Image
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-medium text-sm text-blue-500">AI-GENERATED SUMMARY</h3>
                        <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                          <p><strong>Key Concept:</strong> Photosynthesis converts light energy into chemical energy</p>
                          <p><strong>Process:</strong> Carbon dioxide + water → glucose + oxygen</p>
                          <p><strong>Components:</strong> Light-dependent reactions, Calvin cycle</p>
                          <p><strong>Importance:</strong> Produces oxygen, supports food chains, carbon fixation</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-apple-blue text-white font-medium text-center text-sm">
                      View Complete Analysis →
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 rounded-full filter blur-3xl opacity-60 animate-pulse-subtle"></div>
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-blue-50 rounded-full filter blur-3xl opacity-60 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tagline section */}
      <div className="bg-apple-gray py-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-semibold text-apple-dark max-w-4xl mx-auto px-4">
          Designed to be loved.<br />Engineered to help you study.
        </h2>
      </div>
    </div>
  );
};

export default Hero;
