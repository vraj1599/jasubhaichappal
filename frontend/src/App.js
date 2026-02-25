import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminLoginPage from './pages/AdminLoginPage';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL = 'http://localhost:8001'
export const API = `${BACKEND_URL}/api`;

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

function App() {
  const [cart, setCart] = useState([]);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('session_id');
    if (!id) {
      id = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('session_id', id);
    }
    return id;
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await axios.get(`${API}/cart/${sessionId}`);
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async (items) => {
    try {
      await axios.post(`${API}/cart/${sessionId}`, items);
      setCart(items);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = async (product, size, color) => {
    const existingItem = cart.find(
      (item) => item.product_id === product.id && item.size === size && item.color === color
    );

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.product_id === product.id && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { product_id: product.id, quantity: 1, size, color }];
    }

    await saveCart(newCart);
  };

  const updateCartItem = async (product_id, size, color, quantity) => {
    const newCart = cart
      .map((item) =>
        item.product_id === product_id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
      .filter((item) => item.quantity > 0);

    await saveCart(newCart);
  };

  const removeFromCart = async (product_id, size, color) => {
    const newCart = cart.filter(
      (item) => !(item.product_id === product_id && item.size === size && item.color === color)
    );
    await saveCart(newCart);
  };

  const clearCart = async () => {
    await saveCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, addToCart, updateCartItem, removeFromCart, clearCart }}
    >
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Login (Public) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Protected Admin Route */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </div>
    </CartContext.Provider>
  );
}

export default App;
