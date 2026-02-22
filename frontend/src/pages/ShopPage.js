import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    loadProducts();
  }, [categoryFilter]);

  const loadProducts = async () => {
    try {
      let url = `${API}/products`;
      if (categoryFilter) {
        url += `?category=${categoryFilter}`;
      }
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold mb-4">
            {categoryFilter ? `${categoryFilter} Collection` : 'All Products'}
          </h1>
          <p className="font-body text-muted-foreground">Discover our handcrafted collection</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12" data-testid="no-products-message">
            <p className="font-body text-muted-foreground mb-4">No products available yet.</p>
            <p className="font-body text-sm text-muted-foreground">Check back soon for our beautiful collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/product/${product.id}`} className="group block" data-testid={`product-card-${index}`}>
                  <div className="bg-white border border-border/40 hover:border-primary/20 hover:shadow-[0_8px_30px_rgba(128,0,32,0.12)] transition-all duration-300 overflow-hidden rounded-sm">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.discount_price && (
                        <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                          {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-body font-semibold text-foreground mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
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
                      <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                        data-testid={`view-product-${index}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
