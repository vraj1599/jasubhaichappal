import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import '@/App.css';

import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PolicyPage from '@/pages/PolicyPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/policy/:type" element={<PolicyPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </div>
    </CartContext.Provider>
  );
}

export default App;
