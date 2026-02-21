import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { useState, useEffect } from 'react';

const Layout = ({ children, cartCount = 0, wishlistCount = 0 }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm'
            : 'bg-white'
        } border-b border-primary/10`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                Jasubhai Chappal
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                data-testid="nav-home"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                data-testid="nav-shop"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/shop' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/about"
                data-testid="nav-about"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/about' ? 'text-primary' : 'text-foreground'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                data-testid="nav-contact"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/contact' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/wishlist" className="relative" data-testid="wishlist-icon">
                <Heart className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative" data-testid="cart-icon">
                <ShoppingCart className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                to="/admin"
                data-testid="admin-link"
                className="hidden md:block px-4 py-2 text-sm font-medium text-primary border border-primary rounded-none hover:bg-primary hover:text-white transition-all duration-300"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-white py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-secondary mb-4">
                Jasubhai Chappal
              </h3>
              <p className="text-sm text-secondary/80">
                Handcrafted with love in Mahemdavad, Gujarat. Premium quality ladies fancy chappals for every occasion.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-secondary mb-4 text-sm tracking-widest uppercase">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop" className="text-sm text-white/80 hover:text-secondary transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-white/80 hover:text-secondary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-white/80 hover:text-secondary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-semibold text-secondary mb-4 text-sm tracking-widest uppercase">
                Policies
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/shipping-policy" className="text-sm text-white/80 hover:text-secondary transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="text-sm text-white/80 hover:text-secondary transition-colors">
                    Return & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-sm text-white/80 hover:text-secondary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-white/80 hover:text-secondary transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-secondary mb-4 text-sm tracking-widest uppercase">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <span className="text-sm text-white/80">Mahemdavad, Kheda District, Gujarat</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm text-white/80">+91 98765 43210</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm text-white/80">info@jasubhaichappal.com</span>
                </li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-secondary hover:text-secondary/80 transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-secondary hover:text-secondary/80 transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-secondary/20 text-center">
            <p className="text-sm text-secondary/80">
              © {new Date().getFullYear()} Jasubhai Chappal. All rights reserved. Made with love in Gujarat.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
