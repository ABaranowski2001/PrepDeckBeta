import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  // Fix navigateToHome to scroll to top if already on home page
  const navigateToHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMenu();
    } else {
      navigate('/');
      closeMenu();
    }
  };
  
  const scrollToFeatures = () => {
    navigate('/#features');
    closeMenu();
    
    // If already on home page, scroll to features section
    if (location.pathname === '/') {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';
  const isUploadPage = location.pathname === '/upload';
  const isResultsPage = location.pathname === '/results';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    closeMenu();
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/20 dark:bg-black/80 dark:border-gray-800/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <span className="text-xl font-medium">PrepDeck</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <>
              {!user && (
                <>
                  <button 
                    onClick={navigateToHome} 
                    className={`text-sm font-medium transition-colors duration-200 text-apple-blue hover:text-blue-600`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={scrollToFeatures}
                    className={`text-sm font-medium transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-500`}
                  >
                    Features
                  </button>
                </>
              )}
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive('/dashboard') ? 'text-apple-blue' : 'text-gray-900 dark:text-white hover:text-blue-500'
                    }`}
                  >
                    My Documents
                  </Link>
                  <Link 
                    to="/upload" 
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive('/upload') ? 'text-apple-blue' : 'text-gray-900 dark:text-white hover:text-blue-500'
                    }`}
                  >
                    Upload
                  </Link>
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                isHomePage && (
                  <Link to="/upload">
                    <Button className="rounded-full bg-apple-blue hover:bg-blue-600 text-white px-6 py-1 h-9 text-sm font-medium transition-all duration-300">
                      Try Now
                    </Button>
                  </Link>
                )
              )}
            </>
          </nav>

          <div className="md:hidden flex items-center">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div 
          className={`fixed inset-x-0 top-16 bottom-0 bg-white dark:bg-black z-40 transform transition-transform duration-300 ease-apple ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col space-y-3 pt-4 px-6">
            <>
              {!user && (
                <>
                  <button 
                    onClick={navigateToHome}
                    className="py-3 text-lg font-medium text-apple-blue text-left"
                  >
                    Home
                  </button>
                  <button 
                    onClick={scrollToFeatures}
                    className="py-3 text-lg font-medium text-gray-900 dark:text-white text-left"
                  >
                    Features
                  </button>
                </>
              )}
              {user ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="py-3 text-lg font-medium text-gray-900 dark:text-white text-left"
                    onClick={closeMenu}
                  >
                    My Documents
                  </Link>
                  <Link 
                    to="/upload"
                    className="py-3 text-lg font-medium text-gray-900 dark:text-white text-left"
                    onClick={closeMenu}
                  >
                    Upload
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="py-3 text-lg font-medium text-red-600 text-left flex items-center"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                isHomePage && (
                  <Link 
                    to="/upload"
                    className="py-3 text-lg font-medium text-apple-blue text-left"
                    onClick={closeMenu}
                  >
                    Try Now
                  </Link>
                )
              )}
            </>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

