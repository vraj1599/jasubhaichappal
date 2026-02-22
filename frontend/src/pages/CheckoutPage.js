import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, useCart } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import useRazorpay from 'react-razorpay';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    loadProducts();
  }, [cart]);

  const loadProducts = async () => {
    try {
      const productIds = [...new Set(cart.map((item) => item.product_id))];
      const productPromises = productIds.map((id) => axios.get(`${API}/products/${id}`));
      const responses = await Promise.all(productPromises);
      setProducts(responses.map((res) => res.data));
    } catch (error) {
      console.error('Error loading products:', error);
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const response = await axios.post(`${API}/coupons/validate`, { code: couponCode });
      const discountPercent = response.data.discount_percent;
      setDiscount(discountPercent);
      toast.success(`Coupon applied! ${discountPercent}% discount`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid coupon code');
      setDiscount(0);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.address_line1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const subtotal = calculateSubtotal();
      const discountAmount = (subtotal * discount) / 100;
      const total = subtotal - discountAmount;

      const items = getCartItemsWithDetails().map((item) => ({
        product_id: item.product_id,
        name: item.product.name,
        price: item.product.discount_price || item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const orderData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: {
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items,
        subtotal,
        discount: discountAmount,
        total,
        coupon_code: couponCode || null,
      };

      const orderResponse = await axios.post(`${API}/orders`, orderData);
      const orderId = orderResponse.data.id;

      const paymentResponse = await axios.post(`${API}/payment/create-order`, {
        order_id: orderId,
        amount: total,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'test_key',
        amount: paymentResponse.data.amount,
        currency: paymentResponse.data.currency,
        order_id: paymentResponse.data.razorpay_order_id,
        name: 'Jasubhai Chappal',
        description: 'Purchase of handmade chappals',
        handler: async (response) => {
          try {
            await axios.post(`${API}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id || paymentResponse.data.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id || 'mock_payment',
              razorpay_signature: response.razorpay_signature || 'mock_signature',
            });

            await clearCart();
            toast.success('Order placed successfully!');
            navigate(`/order-success/${orderId}`);
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.customer_name,
          email: formData.customer_email,
          contact: formData.customer_phone,
        },
        theme: {
          color: '#800020',
        },
      };

      if (paymentResponse.data.mock) {
        await axios.post(`${API}/payment/verify`, {
          razorpay_order_id: paymentResponse.data.razorpay_order_id,
          razorpay_payment_id: 'mock_payment',
          razorpay_signature: 'mock_signature',
        });
        await clearCart();
        toast.success('Order placed successfully! (Test Mode)');
        navigate(`/order-success/${orderId}`);
      } else {
        const rzp = new Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold mb-8" data-testid="checkout-title">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-sm border border-border">
                <h2 className="font-heading text-2xl text-primary font-bold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone *</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      required
                      data-testid="input-phone"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm border border-border">
                <h2 className="font-heading text-2xl text-primary font-bold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address_line1">Address Line 1 *</Label>
                    <Input
                      id="address_line1"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      required
                      data-testid="input-address1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address_line2">Address Line 2</Label>
                    <Input
                      id="address_line2"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      data-testid="input-address2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        data-testid="input-state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        data-testid="input-pincode"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white p-6 rounded-sm border border-border sticky top-24 space-y-6">
                <h2 className="font-heading text-2xl text-primary font-bold">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold" data-testid="checkout-subtotal">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-body text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span data-testid="checkout-discount">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-body text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary" data-testid="checkout-total">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      data-testid="input-coupon"
                    />
                    <Button
                      type="button"
                      onClick={handleApplyCoupon}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      data-testid="apply-coupon-button"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-lg py-6"
                  data-testid="place-order-button"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
