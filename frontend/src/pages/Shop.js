import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      const categoriesRes = await axios.get(`${API}/categories`);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API}/products`;
      const params = [];
      if (selectedCategory !== 'all') params.push(`category_id=${selectedCategory}`);
      if (searchQuery) params.push(`search=${searchQuery}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await axios.post(`${API}/cart/${userId}/add`, {
        product_id: productId,
        quantity: 1
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await axios.post(`${API}/wishlist/${userId}/add`, {
        product_id: productId
      });
      toast.success('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-accent/20 py-16" data-testid="shop-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">
            Shop Our Collection
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover handcrafted chappals for every occasion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="search-input"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20" data-testid="no-products">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-testid="products-grid">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-card"
                data-testid={`product-card-${product.id}`}
              >
                <Link to={`/product/${product.slug}`}>
                  <div className="relative overflow-hidden aspect-[3/4] bg-muted">
                    <img
                      src={product.images[0] || 'https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.discount_price && (
                      <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 text-sm font-semibold">
                        {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                </Link>

                {/* Quick Actions */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => addToWishlist(product.id)}
                    className="bg-white p-2 shadow-md hover:bg-accent transition-colors"
                    data-testid={`wishlist-btn-${product.id}`}
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-5 h-5 text-primary" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    {product.discount_price ? (
                      <>
                        <span className="text-secondary font-semibold text-lg">₹{product.discount_price}</span>
                        <span className="text-muted-foreground line-through text-sm">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-secondary font-semibold text-lg">₹{product.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-primary text-white py-2 hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2"
                    data-testid={`add-to-cart-btn-${product.id}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
