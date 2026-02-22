import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API, useCart } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      setSelectedSize(response.data.sizes[0] || '');
      setSelectedColor(response.data.colors[0] || '');
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    await addToCart(product, selectedSize, selectedColor);
    toast.success('Added to cart!');
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

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center font-body text-muted-foreground">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square overflow-hidden rounded-sm border border-border mb-4"
              data-testid="product-main-image"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-sm border-2 transition-all duration-200 ${
                      selectedImage === index ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold mb-4" data-testid="product-name">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              {product.discount_price ? (
                <>
                  <span className="font-body font-bold text-primary text-3xl" data-testid="product-price">
                    ₹{product.discount_price}
                  </span>
                  <span className="font-body text-muted-foreground line-through text-xl">
                    ₹{product.price}
                  </span>
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="font-body font-bold text-primary text-3xl" data-testid="product-price">
                  ₹{product.price}
                </span>
              )}
            </div>

            <p className="font-body text-muted-foreground mb-6 leading-relaxed" data-testid="product-description">
              {product.description}
            </p>

            <div className="mb-6">
              <h3 className="font-body font-semibold text-foreground mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded-full border-2 font-body transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                    data-testid={`size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-body font-semibold text-foreground mb-3">Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-2 rounded-full border-2 font-body transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                    data-testid={`color-${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-lg py-6"
                data-testid="add-to-cart-button"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-body font-semibold text-foreground mb-3">Product Details</h3>
              <ul className="font-body text-muted-foreground space-y-2">
                <li>• Category: {product.category}</li>
                <li>• 100% Handmade</li>
                <li>• Premium Quality Materials</li>
                <li>• Comfortable & Durable</li>
              </ul>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl md:text-3xl text-primary font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-sm border border-border" data-testid="review-item">
                  <div className="flex items-center mb-2">
                    <h4 className="font-body font-semibold text-foreground mr-3">{review.name}</h4>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                  <p className="font-body text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
