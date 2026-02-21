import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', 'guest');
    }
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        <div className="bg-card p-8 shadow-md mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-secondary" />
            <h2 className="font-serif text-2xl font-semibold text-primary">Order Details</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-semibold text-foreground">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date</span>
              <span className="font-semibold text-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status</span>
              <span className="font-semibold text-foreground capitalize">{order.payment_status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Status</span>
              <span className="font-semibold text-foreground capitalize">{order.order_status}</span>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                    {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                  </div>
                  <p className="font-semibold text-secondary">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6">
            <div className="flex justify-between text-lg font-semibold text-foreground">
              <span>Total</span>
              <span className="text-secondary">₹{order.total}</span>
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6">
            <h3 className="font-semibold text-foreground mb-3">Shipping Address</h3>
            <p className="text-muted-foreground">{order.shipping_address.name}</p>
            <p className="text-muted-foreground">{order.shipping_address.phone}</p>
            <p className="text-muted-foreground">
              {order.shipping_address.address_line1}
              {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
            </p>
            <p className="text-muted-foreground">
              {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/shop">
            <button className="bg-primary text-white px-8 py-3 hover:bg-primary/90 transition-colors font-semibold">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
