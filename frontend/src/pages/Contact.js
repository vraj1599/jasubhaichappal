import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-3xl font-semibold text-primary mb-6">Get in Touch</h2>
            <p className="text-foreground/80 leading-relaxed mb-8">
              Have questions about our products or need assistance with your order? We're here to help!
              Reach out to us through any of the channels below.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Address</h3>
                  <p className="text-muted-foreground">Mahemdavad, Kheda District, Gujarat, India</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-1 inline-block"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">info@jasubhaichappal.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="font-serif text-3xl font-semibold text-primary mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="contact-name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="contact-email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="contact-phone"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  data-testid="contact-message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 hover:bg-primary/90 transition-colors font-semibold"
                data-testid="contact-submit"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
