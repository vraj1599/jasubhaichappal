import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, useCart } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [cart]);

  const loadProducts = async () => {
    if (cart.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const productIds = [...new Set(cart.map((item) => item.product_id))];
      const productPromises = productIds.map((id) => axios.get(`${API}/products/${id}`));
      const responses = await Promise.all(productPromises);
      setProducts(responses.map((res) => res.data));
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error loading cart items');
    } finally {
      setLoading(false);
    }
  };

  const getCartItemsWithDetails = () => {
    return cart.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return { ...item, product };
    });
  };

  const calculateSubtotal = () => {
    const items = getCartItemsWithDetails();
    return items.reduce((sum, item) => {
      if (!item.product) return sum;
      const price = item.product.discount_price || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(item.product_id, item.size, item.color, newQuantity);
  };

  const handleRemove = async (item) => {
    await removeFromCart(item.product_id, item.size, item.color);
    toast.success('Item removed from cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center font-body text-muted-foreground">Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16" data-testid="empty-cart-message">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" strokeWidth={1} />
            <h2 className="font-heading text-2xl md:text-3xl text-primary font-bold mb-4">Your cart is empty</h2>
            <p className="font-body text-muted-foreground mb-8">Add some beautiful chappals to get started!</p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
              data-testid="shop-now-button"
            >
              <Link to="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cartItems = getCartItemsWithDetails();
  const subtotal = calculateSubtotal();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold mb-8" data-testid="cart-title">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  className="bg-white p-6 rounded-sm border border-border flex flex-col sm:flex-row gap-6"
                  data-testid={`cart-item-${index}`}
                >
                  {item.product && (
                    <>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-32 h-32 object-cover rounded-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-body font-semibold text-foreground text-lg mb-2">
                          {item.product.name}
                        </h3>
                        <p className="font-body text-muted-foreground text-sm mb-2">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="font-body font-bold text-primary text-lg mb-4">
                          ₹{item.product.discount_price || item.product.price}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-border hover:border-primary transition-colors flex items-center justify-center"
                              data-testid={`decrease-quantity-${index}`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-body font-semibold w-8 text-center" data-testid={`quantity-${index}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-border hover:border-primary transition-colors flex items-center justify-center"
                              data-testid={`increase-quantity-${index}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            data-testid={`remove-item-${index}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-sm border border-border sticky top-24">
              <h2 className="font-heading text-2xl text-primary font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold" data-testid="cart-subtotal">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-body text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary" data-testid="cart-total">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-lg py-6"
                data-testid="proceed-checkout-button"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
