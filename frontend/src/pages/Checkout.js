import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    fetchData();
    loadRazorpayScript().then(loaded => setRazorpayLoaded(loaded));
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const [cartRes, configRes] = await Promise.all([
        axios.get(`${API}/cart/${userId}`),
        axios.get(`${API}/config/razorpay`)
      ]);

      if (!cartRes.data.items || cartRes.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }

      setCart(cartRes.data);
      setRazorpayKeyId(configRes.data.key_id);

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
      console.error('Error fetching data:', error);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const product = products[item.product_id];
      if (!product) return sum;
      const price = product.discount_price || product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.address_line1 || 
        !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all required fields');
      return false;
    }
    if (formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (formData.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const total = calculateTotal();

      // Prepare order items
      const orderItems = cart.items.map(item => {
        const product = products[item.product_id];
        return {
          product_id: item.product_id,
          product_name: product.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: product.discount_price || product.price
        };
      });

      // Create order
      const orderRes = await axios.post(`${API}/orders/create`, {
        user_id: userId,
        items: orderItems,
        shipping_address: formData,
        subtotal: total,
        discount: 0,
        total: total
      });

      const order = orderRes.data;

      if (!razorpayKeyId || !order.razorpay_order_id) {
        // COD or Razorpay not configured
        toast.success('Order placed successfully!');
        await axios.delete(`${API}/cart/${userId}`);
        navigate(`/order-confirmation/${order.id}`);
        return;
      }

      // Razorpay payment
      const options = {
        key: razorpayKeyId,
        amount: order.total * 100, // Convert to paise
        currency: 'INR',
        name: 'Jasubhai Chappal',
        description: 'Handmade Ladies Fancy Chappal',
        order_id: order.razorpay_order_id,
        handler: async (response) => {
          try {
            await axios.post(`${API}/orders/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id
            });
            toast.success('Payment successful!');
            await axios.delete(`${API}/cart/${userId}`);
            navigate(`/order-confirmation/${order.id}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone
        },
        theme: {
          color: '#800020'
        }
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-primary mb-2">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-card p-8">
              <h2 className="font-serif text-2xl font-semibold text-primary mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength="10"
                    className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="phone-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="address1-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="address2-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                      data-testid="city-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                      data-testid="state-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength="6"
                    className="w-full px-4 py-3 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="pincode-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 sticky top-24" data-testid="checkout-summary">
              <h2 className="font-serif text-2xl font-semibold text-primary mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart && cart.items.map((item, index) => {
                  const product = products[item.product_id];
                  if (!product) return null;
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-foreground">{product.name} x {item.quantity}</span>
                      <span className="text-foreground">₹{((product.discount_price || product.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border pt-3 space-y-2 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span className="text-secondary">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-3 hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
                data-testid="place-order-btn"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
