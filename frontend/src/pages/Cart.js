import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const cartRes = await axios.get(`${API}/cart/${userId}`);
      setCart(cartRes.data);

      // Fetch product details
      const productIds = [...new Set(cartRes.data.items.map(item => item.product_id))];
      const productPromises = productIds.map(id => axios.get(`${API}/products/${id}`));
      const productResponses = await Promise.all(productPromises);
      const productsMap = {};
      productResponses.forEach(res => {
        productsMap[res.data.id] = res.data;
      });
      setProducts(productsMap);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, size, color) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await axios.delete(`${API}/cart/${userId}/item/${productId}`, {
        params: { size, color }
      });
      toast.success('Removed from cart');
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await removeFromCart(item.product_id, item.size, item.color);
      await axios.post(`${API}/cart/${userId}/add`, {
        product_id: item.product_id,
        quantity: newQuantity,
        size: item.size,
        color: item.color
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const product = products[item.product_id];
      if (!product) return sum;
      const price = product.discount_price || product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const proceedToCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-primary mb-2">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-cart">
            <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
            <Link to="/shop">
              <button className="bg-primary text-white px-8 py-3 hover:bg-primary/90 transition-colors" data-testid="continue-shopping-btn">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
              {cart.items.map((item, index) => {
                const product = products[item.product_id];
                if (!product) return null;
                const price = product.discount_price || product.price;

                return (
                  <div key={index} className="bg-card p-6 flex gap-6" data-testid={`cart-item-${index}`}>
                    <img
                      src={product.images[0] || 'https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg'}
                      alt={product.name}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                        {product.name}
                      </h3>
                      {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                      {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                      <p className="text-secondary font-semibold mt-2">₹{price}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.product_id, item.size, item.color)}
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`remove-item-${index}`}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="w-8 h-8 border border-border hover:border-primary transition-colors flex items-center justify-center"
                          data-testid={`decrease-qty-${index}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold" data-testid={`quantity-${index}`}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="w-8 h-8 border border-border hover:border-primary transition-colors flex items-center justify-center"
                          data-testid={`increase-qty-${index}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 sticky top-24" data-testid="order-summary">
                <h2 className="font-serif text-2xl font-semibold text-primary mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-semibold text-foreground">
                    <span>Total</span>
                    <span className="text-secondary">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-primary text-white py-3 hover:bg-primary/90 transition-colors font-semibold"
                  data-testid="checkout-btn"
                >
                  Proceed to Checkout
                </button>
                <Link to="/shop">
                  <button className="w-full mt-3 border border-primary text-primary py-3 hover:bg-primary hover:text-white transition-colors" data-testid="continue-shopping-link">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
