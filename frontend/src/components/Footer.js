import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-2xl mb-4 text-secondary">Jasubhai Chappal</h3>
            <p className="font-body text-sm opacity-90">
              Handcrafted ladies fancy chappal from the heart of Gujarat
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4 text-secondary">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/shop" className="block text-sm hover:text-secondary transition-colors" data-testid="footer-link-shop">
                Shop
              </Link>
              <Link to="/about" className="block text-sm hover:text-secondary transition-colors" data-testid="footer-link-about">
                About Us
              </Link>
              <Link to="/contact" className="block text-sm hover:text-secondary transition-colors" data-testid="footer-link-contact">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4 text-secondary">Policies</h4>
            <div className="space-y-2">
              <Link to="/policy/shipping" className="block text-sm hover:text-secondary transition-colors" data-testid="footer-link-shipping">
                Shipping Policy
              </Link>
              <Link to="/policy/returns" className="block text-sm hover:text-secondary transition-colors" data-testid="footer-link-returns">
                Return & Refund
              </Link>
              <Link to="/policy/privacy" className="block text-sm hover:text-secondary transition-colors" data-testid="footer-link-privacy">
                Privacy Policy
              </Link>
              <Link to="/policy/terms" className="block text-sm hover:text-secondary transition-colors" data-testid="footer-link-terms">
                Terms & Conditions
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4 text-secondary">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <p className="text-sm">Mahemdavad, Kheda District, Gujarat, India</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">info@jasubhaichappal.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Jasubhai Chappal. Handmade with love in Gujarat.
          </p>
        </div>
      </div>
    </footer>
  );
}
