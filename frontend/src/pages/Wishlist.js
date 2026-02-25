import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const wishlistRes = await axios.get(`${API}/wishlist/${userId}`);
      setWishlist(wishlistRes.data);

      if (wishlistRes.data.items && wishlistRes.data.items.length > 0) {
        const productIds = wishlistRes.data.items.map(item => item.product_id);
        const productPromises = productIds.map(id => axios.get(`${API}/products/${id}`));
        const productResponses = await Promise.all(productPromises);
        const productsMap = {};
        productResponses.forEach(res => {
          productsMap[res.data.id] = res.data;
        });
        setProducts(productsMap);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await axios.delete(`${API}/wishlist/${userId}/item/${productId}`);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-primary mb-2">My Wishlist</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!wishlist || wishlist.items.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-wishlist">
            <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-6">Your wishlist is empty</p>
            <Link to="/shop">
              <button className="bg-primary text-white px-8 py-3 hover:bg-primary/90 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-testid="wishlist-items">
            {wishlist.items.map((item, index) => {
              const product = products[item.product_id];
              if (!product) return null;

              return (
                <div key={index} className="bg-card relative group" data-testid={`wishlist-item-${index}`}>
                  <Link to={`/product/${product.slug}`}>
                    <div className="relative overflow-hidden aspect-[3/4] bg-muted">
                      <img
                        src={product.images[0] || 'https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 bg-white p-2 shadow-md hover:bg-destructive hover:text-white transition-colors"
                    data-testid={`remove-wishlist-${index}`}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

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
                      className="w-full bg-primary text-white py-2 hover:bg-primary/90 transition-colors"
                      data-testid={`add-to-cart-${index}`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
