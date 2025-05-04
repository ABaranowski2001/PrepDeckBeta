import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturesCarousel from '@/components/FeaturesCarousel';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* How It Works Section */}
        <section className="apple-card mx-4 lg:mx-8 rounded-3xl overflow-hidden -mt-10 relative z-10">
          <div className="px-6 py-16 md:px-10 lg:px-16 lg:py-20">
            <div className="text-center mb-16 apple-appear">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">How It Works</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center space-y-5 apple-appear" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-blue-100 text-apple-blue rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold">Upload a File</h3>
                <p className="text-gray-600">Upload an existing PDF or document file</p>
              </div>
              
              <div className="text-center space-y-5 apple-appear" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-blue-100 text-apple-blue rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold">AI Processing</h3>
                <p className="text-gray-600">Our advanced AI analyzes and extracts key information from the text</p>
              </div>
              
              <div className="text-center space-y-5 apple-appear" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 bg-blue-100 text-apple-blue rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold">Get Results</h3>
                <p className="text-gray-600">Receive a concise summary, cue cards, and practice quiz questions</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section with ID for navigation - now using the carousel */}
        <section id="features" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-10 apple-appear">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">Explore PrepDeck Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                World-class tools for your educational journey
              </p>
            </div>
            
            <FeaturesCarousel />
          </div>
        </section>
        
        {/* CTA Section - Removing content under the heading as requested */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-apple-blue to-blue-500"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full"></div>
          </div>
          
          <div className="section-container text-center space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold text-white apple-appear">
              Ready to Transform Your Study Experience?
            </h2>
            <a 
              href={user ? "/dashboard" : "/upload"}
              className="inline-flex items-center justify-center bg-white text-apple-blue font-medium rounded-full px-8 py-3 shadow-lg hover:bg-gray-50 transition-all duration-300 apple-appear apple-appear-delay-2"
            >
              {user ? "Go to My Documents" : "Try it for free"}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
