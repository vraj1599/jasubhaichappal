import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Heart } from 'lucide-react';

const Navbar = ({ cartCount = 0, wishlistCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white'
      } border-b border-primary/10`}
      style={{ minHeight: '80px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ minHeight: '80px' }}>
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center flex-shrink-0" 
            data-testid="navbar-logo"
          >
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-primary font-bold" style={{ whiteSpace: 'nowrap' }}>
              Jasubhai Chappal
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1" style={{ margin: '0 2rem' }}>
            <div className="flex items-center">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-base font-medium transition-all duration-200 hover:text-primary ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-foreground'
                  }`}
                  style={{ 
                    marginLeft: index === 0 ? '0' : '2rem',
                    marginRight: index === navLinks.length - 1 ? '0' : '2rem',
                    whiteSpace: 'nowrap',
                    display: 'inline-block'
                  }}
                  data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                >
                  {link.name}
                  <span
                    className={`absolute left-0 w-0 bg-primary transition-all duration-300 hover:w-full ${
                      location.pathname === link.path ? 'w-full' : ''
                    }`}
                    style={{ 
                      bottom: '-4px',
                      height: '2px'
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center" style={{ gap: '1rem' }}>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-primary/10 rounded-full transition-all duration-200"
              data-testid="wishlist-icon-button"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground hover:text-primary transition-colors" />
              {wishlistCount > 0 && (
                <span
                  className="absolute bg-primary text-white rounded-full text-xs flex items-center justify-center font-semibold"
                  style={{ 
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px'
                  }}
                  data-testid="wishlist-count-badge"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-primary/10 rounded-full transition-all duration-200"
              data-testid="cart-icon-button"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span
                  className="absolute bg-primary text-white rounded-full text-xs flex items-center justify-center font-semibold"
                  style={{ 
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px'
                  }}
                  data-testid="cart-count-badge"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Button */}
            {/* <Link
              to="/admin"
              className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary hover:bg-primary hover:text-white transition-all duration-300"
              data-testid="admin-link"
              style={{ whiteSpace: 'nowrap' }}
            >
              Admin
            </Link> */}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              data-testid="mobile-menu-button"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden bg-white border-t border-border/40 shadow-lg"
          data-testid="mobile-menu"
          style={{ animation: 'slideDown 0.2s ease-out' }}
        >
          <div className="px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary bg-accent/20'
                    : 'text-foreground hover:text-primary hover:bg-accent/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                style={{ marginBottom: '0.25rem' }}
              >
                {link.name}
              </Link>
            ))}
            
            {/* <Link
              to="/admin"
              className="block px-4 py-3 text-base font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-all"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-admin-link"
              style={{ marginTop: '0.75rem' }}
            >
              Admin Dashboard
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;