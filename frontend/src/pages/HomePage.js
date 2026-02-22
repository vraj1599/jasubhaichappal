import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Heart, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products?featured=true`);
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Wedding Collection', image: 'https://images.unsplash.com/photo-1769103948746-8592931bbdad?crop=entropy&cs=srgb&fm=jpg', link: '/shop?category=Wedding' },
    { name: 'Party Wear', image: 'https://images.pexels.com/photos/28834219/pexels-photo-28834219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', link: '/shop?category=Party' },
    { name: 'Daily Wear', image: 'https://images.pexels.com/photos/7579468/pexels-photo-7579468.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', link: '/shop?category=Daily' },
    { name: 'Festive Special', image: 'https://images.unsplash.com/photo-1758120221783-5741d0b35096?crop=entropy&cs=srgb&fm=jpg', link: '/shop?category=Festive' },
  ];

  const features = [
    { icon: Sparkles, title: '100% Handmade', description: 'Crafted with care by skilled artisans' },
    { icon: ShieldCheck, title: 'Premium Quality', description: 'Only the finest materials used' },
    { icon: Heart, title: 'Comfortable & Stylish', description: 'Perfect blend of comfort and fashion' },
    { icon: Truck, title: 'Fast Shipping', description: 'Delivery across India' },
  ];

  const testimonials = [
    { name: 'Priya Patel', rating: 5, comment: 'Beautiful chappals! The quality is amazing and very comfortable.', image: 'https://images.pexels.com/photos/20021591/pexels-photo-20021591.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Sneha Shah', rating: 5, comment: 'Perfect for my wedding! Everyone asked where I got them from.', image: 'https://images.pexels.com/photos/2723624/pexels-photo-2723624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative h-[90vh] flex items-center" data-testid="hero-section">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/28834219/pexels-photo-28834219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="font-accent text-secondary text-3xl md:text-4xl mb-4">Handcrafted with Love</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-primary font-bold mb-6 leading-tight">
              Ladies Fancy Chappal
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground mb-8">
              Premium comfort & style for every occasion. Handmade in Gujarat.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-medium"
                data-testid="hero-shop-now-button"
              >
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8 py-6 text-lg"
                data-testid="hero-explore-button"
              >
                <Link to="/shop">Explore Collection</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4">
              Featured Collections
            </h2>
            <p className="font-body text-muted-foreground text-lg">Discover our handpicked collections</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={category.link} className="group block" data-testid={`category-card-${index}`}>
                  <div className="relative overflow-hidden rounded-sm aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
                      <h3 className="font-heading text-2xl text-white p-6 w-full">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4">
              Why Choose Jasubhai Chappal
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-muted/50 hover:bg-white transition-all duration-300 border border-transparent hover:border-border rounded-sm"
                data-testid={`feature-card-${index}`}
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="font-heading text-xl text-foreground mb-2">{feature.title}</h3>
                <p className="font-body text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30" data-testid="featured-products-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4">
                Featured Products
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/product/${product.id}`} className="group block" data-testid={`featured-product-${index}`}>
                    <div className="bg-white border border-border/40 hover:border-primary/20 transition-all duration-300 overflow-hidden rounded-sm">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-body font-semibold text-foreground mb-2">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          {product.discount_price ? (
                            <>
                              <span className="font-body font-bold text-primary text-lg">
                                ₹{product.discount_price}
                              </span>
                              <span className="font-body text-muted-foreground line-through text-sm">
                                ₹{product.price}
                              </span>
                            </>
                          ) : (
                            <span className="font-body font-bold text-primary text-lg">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                data-testid="view-all-products-button"
              >
                <Link to="/shop">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-sm border border-border shadow-[0_4px_20px_rgba(128,0,32,0.05)]"
                data-testid={`testimonial-${index}`}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-body font-semibold text-foreground">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="font-body text-muted-foreground italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20chappals"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        data-testid="whatsapp-button"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <Footer />
    </div>
  );
}
