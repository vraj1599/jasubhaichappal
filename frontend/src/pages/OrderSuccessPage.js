import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center font-body text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-12 rounded-sm border border-border text-center"
          data-testid="order-success-card"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          
          <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="font-body text-muted-foreground text-lg mb-8">
            Thank you for your order. We've received your payment and will start processing your order soon.
          </p>

          {order && (
            <div className="bg-muted/50 p-6 rounded-sm mb-8 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-body text-sm text-muted-foreground mb-1">Order Number</p>
                  <p className="font-body font-semibold text-foreground" data-testid="order-number">{order.order_number}</p>
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="font-body font-semibold text-primary text-lg" data-testid="order-total">₹{order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground mb-1">Customer Name</p>
                  <p className="font-body font-semibold text-foreground">{order.customer_name}</p>
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-body font-semibold text-foreground">{order.customer_email}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-body text-sm text-muted-foreground mb-1">Shipping Address</p>
                <p className="font-body text-foreground">
                  {order.shipping_address.address_line1}<br />
                  {order.shipping_address.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <p className="font-body text-muted-foreground">
              A confirmation email has been sent to your email address.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                data-testid="continue-shopping-button"
              >
                <Link to="/shop">Continue Shopping</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8"
                data-testid="back-home-button"
              >
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
