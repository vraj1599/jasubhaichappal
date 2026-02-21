import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/products?featured=true&limit=8`),
        axios.get(`${API}/categories`)
      ]);
      setFeaturedProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/29169312/pexels-photo-29169312.jpeg"
            alt="Bride feet with mehndi and traditional chappals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
              Handmade Ladies Fancy Chappal
            </h1>
            <p className="font-accent text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
              Crafted with Love, Premium Comfort & Style for Every Occasion
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" data-testid="hero-shop-now-btn">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 py-3 font-serif transition-all duration-300 shadow-md hover:shadow-lg">
                  Shop Now
                </button>
              </Link>
              <Link to="/shop" data-testid="hero-explore-btn">
                <button className="border border-primary text-primary hover:bg-primary hover:text-white rounded-none px-8 py-3 transition-all duration-300">
                  Explore Collection
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 md:py-24" data-testid="featured-collections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
              Featured Collections
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handcrafted chappal collections for every occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Wedding Collection',
                image: 'https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg',
                slug: 'wedding-collection'
              },
              {
                name: 'Party Wear',
                image: 'https://images.unsplash.com/photo-1770049770706-6fc82ab583d8',
                slug: 'party-wear'
              },
              {
                name: 'Daily Comfort',
                image: 'https://images.pexels.com/photos/8477809/pexels-photo-8477809.jpeg',
                slug: 'daily-comfort'
              }
            ].map((collection, index) => (
              <motion.div
                key={collection.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden aspect-[3/4] cursor-pointer"
                data-testid={`collection-${collection.slug}`}
              >
                <Link to={`/shop?category=${collection.slug}`}>
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-end p-8">
                    <h3 className="font-serif text-3xl text-white font-semibold">
                      {collection.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-accent/30" data-testid="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/5894283/pexels-photo-5894283.jpeg"
                alt="Artisan crafting shoes"
                className="w-full h-[500px] object-cover shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-6">
                Why Choose Jasubhai Chappal
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Experience the perfect blend of traditional craftsmanship and modern comfort
              </p>

              <div className="space-y-6">
                {[
                  { icon: CheckCircle, title: '100% Handmade', desc: 'Each chappal is crafted with care by skilled artisans' },
                  { icon: CheckCircle, title: 'Premium Quality Materials', desc: 'Only the finest materials for lasting comfort' },
                  { icon: CheckCircle, title: 'Comfortable & Stylish', desc: 'Perfect balance of fashion and functionality' },
                  { icon: CheckCircle, title: 'Affordable Pricing', desc: 'Luxury quality at accessible prices' },
                  { icon: CheckCircle, title: 'Made in Gujarat 🇮🇳', desc: 'Supporting local craftsmanship and tradition' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4" data-testid={`feature-${index}`}>
                    <item.icon className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 md:py-24" data-testid="customer-reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya P.',
                image: 'https://images.pexels.com/photos/2723624/pexels-photo-2723624.jpeg',
                text: 'The embroidery is exquisite! Perfect for my wedding. Everyone complimented my chappals.'
              },
              {
                name: 'Anjali M.',
                image: 'https://images.pexels.com/photos/3796810/pexels-photo-3796810.jpeg',
                text: 'So comfortable! I wore them all day at a function without any discomfort. Highly recommend!'
              },
              {
                name: 'Kavita S.',
                image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
                text: 'Beautiful craftsmanship and great quality. The gold work is stunning. Worth every rupee!'
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" data-testid={`review-${index}`}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{review.name}</h4>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{review.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary mb-6">
              Ready to Step in Style?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Explore our complete collection and find the perfect chappal for your next occasion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" data-testid="cta-shop-btn">
                <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-none px-8 py-3 font-serif transition-all duration-300 shadow-md hover:shadow-lg">
                  Shop Now
                </button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" data-testid="cta-whatsapp-btn">
                <button className="border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-none px-8 py-3 transition-all duration-300 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Chat on WhatsApp
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
