import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  const fetchProductData = async () => {
    try {
      const [productRes, reviewsRes] = await Promise.all([
        axios.get(`${API}/products/slug/${slug}`),
        axios.get(`${API}/reviews/product/${slug}`).catch(() => ({ data: [] }))
      ]);
      setProduct(productRes.data);
      if (productRes.data.sizes?.length > 0) setSelectedSize(productRes.data.sizes[0]);
      if (productRes.data.colors?.length > 0) setSelectedColor(productRes.data.colors[0]);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor && product?.colors?.length > 0) {
      toast.error('Please select a color');
      return;
    }

    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await axios.post(`${API}/cart/${userId}/add`, {
        product_id: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const addToWishlist = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await axios.post(`${API}/wishlist/${userId}/add`, {
        product_id: product.id
      });
      toast.success('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4" data-testid="product-images">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={product.images[0] || 'https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((img, index) => (
                  <div key={index} className="aspect-square overflow-hidden bg-muted cursor-pointer">
                    <img src={img} alt={`${product.name} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 h-fit" data-testid="product-info">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              {product.name}
            </h1>

            {/* Reviews */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating) ? 'fill-secondary text-secondary' : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              {product.discount_price ? (
                <>
                  <span className="text-4xl font-bold text-secondary">₹{product.discount_price}</span>
                  <span className="text-2xl text-muted-foreground line-through">₹{product.price}</span>
                  <span className="bg-primary text-white px-3 py-1 text-sm font-semibold">
                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold text-secondary">₹{product.price}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-foreground/80 mb-8 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6" data-testid="size-selector">
                <label className="block text-sm font-semibold text-foreground mb-3 tracking-widest uppercase">
                  Select Size
                </label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 border transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-border hover:border-primary'
                      }`}
                      data-testid={`size-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6" data-testid="color-selector">
                <label className="block text-sm font-semibold text-foreground mb-3 tracking-widest uppercase">
                  Select Color
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 border transition-colors ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-white'
                          : 'border-border hover:border-primary'
                      }`}
                      data-testid={`color-${color}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3 tracking-widest uppercase">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-border hover:border-primary transition-colors"
                  data-testid="decrease-quantity"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center" data-testid="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-border hover:border-primary transition-colors"
                  data-testid="increase-quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {product.in_stock ? (
              <div className="flex items-center gap-2 text-green-600 mb-6">
                <Check className="w-5 h-5" />
                <span className="font-medium">In Stock</span>
              </div>
            ) : (
              <div className="text-destructive mb-6 font-medium">Out of Stock</div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={addToCart}
                disabled={!product.in_stock}
                className="flex-1 bg-primary text-white py-4 hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={addToWishlist}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white py-4 px-8 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                data-testid="add-to-wishlist-btn"
              >
                <Heart className="w-5 h-5" />
                Wishlist
              </button>
            </div>

            {/* Care Instructions */}
            {product.care_instructions && (
              <div className="border-t border-border pt-6" data-testid="care-instructions">
                <h3 className="font-semibold text-foreground mb-3 tracking-widest uppercase text-sm">
                  Care Instructions
                </h3>
                <p className="text-muted-foreground">{product.care_instructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-16" data-testid="reviews-section">
            <h2 className="font-serif text-3xl font-semibold text-primary mb-8">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card p-6 shadow-sm" data-testid={`review-${review.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{review.user_name}</h4>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-secondary text-secondary' : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
