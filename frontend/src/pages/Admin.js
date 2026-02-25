import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    images: [''],
    sizes: [''],
    colors: [''],
    care_instructions: '',
    stock_quantity: '0',
    featured: false
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'products') {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } else if (activeTab === 'categories') {
        const categoriesRes = await axios.get(`${API}/categories`);
        setCategories(categoriesRes.data);
      } else if (activeTab === 'orders') {
        const ordersRes = await axios.get(`${API}/orders`);
        setOrders(ordersRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        stock_quantity: parseInt(productForm.stock_quantity),
        images: productForm.images.filter(img => img.trim() !== ''),
        sizes: productForm.sizes.filter(s => s.trim() !== ''),
        colors: productForm.colors.filter(c => c.trim() !== '')
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct}`, data);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API}/products`, data);
        toast.success('Product created successfully');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '', slug: '', description: '', price: '', discount_price: '',
        category_id: '', images: [''], sizes: [''], colors: [''],
        care_instructions: '', stock_quantity: '0', featured: false
      });
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/categories`, categoryForm);
      toast.success('Category created successfully');
      setShowCategoryForm(false);
      setCategoryForm({ name: '', slug: '', description: '', image_url: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      discount_price: product.discount_price ? product.discount_price.toString() : '',
      category_id: product.category_id,
      images: product.images.length > 0 ? product.images : [''],
      sizes: product.sizes.length > 0 ? product.sizes : [''],
      colors: product.colors.length > 0 ? product.colors : [''],
      care_instructions: product.care_instructions || '',
      stock_quantity: product.stock_quantity.toString(),
      featured: product.featured
    });
    setShowProductForm(true);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/orders/${orderId}/status`, null, { params: { status } });
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'products'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="products-tab"
          >
            <Package className="w-5 h-5 inline mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'categories'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="categories-tab"
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="orders-tab"
          >
            <ShoppingBag className="w-5 h-5 inline mr-2" />
            Orders
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-semibold text-primary">Products</h2>
              <button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                }}
                className="bg-primary text-white px-6 py-2 hover:bg-primary/90 transition-colors flex items-center gap-2"
                data-testid="add-product-btn"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="bg-card p-6 mb-6 shadow-md" data-testid="product-form">
                <h3 className="font-serif text-xl font-semibold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name *</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Slug *</label>
                      <input
                        type="text"
                        value={productForm.slug}
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Price *</label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Discount Price</label>
                      <input
                        type="number"
                        value={productForm.discount_price}
                        onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Stock *</label>
                      <input
                        type="number"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category *</label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-semibold">Featured Product</label>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-primary text-white px-6 py-2 hover:bg-primary/90">
                      {editingProduct ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      className="border border-border px-6 py-2 hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="admin-products-list">
              {products.map(product => (
                <div key={product.id} className="bg-card p-4 shadow-sm" data-testid={`admin-product-${product.id}`}>
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg'}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="font-serif text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-secondary font-semibold mb-3">₹{product.discount_price || product.price}</p>
                  <p className="text-sm text-muted-foreground mb-3">Stock: {product.stock_quantity}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 border border-primary text-primary px-3 py-1.5 hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1"
                      data-testid={`edit-product-${product.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 border border-destructive text-destructive px-3 py-1.5 hover:bg-destructive hover:text-white transition-colors flex items-center justify-center gap-1"
                      data-testid={`delete-product-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-semibold text-primary">Categories</h2>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="bg-primary text-white px-6 py-2 hover:bg-primary/90 transition-colors flex items-center gap-2"
                data-testid="add-category-btn"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>

            {showCategoryForm && (
              <div className="bg-card p-6 mb-6 shadow-md">
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name *</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Slug *</label>
                      <input
                        type="text"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-primary text-white px-6 py-2 hover:bg-primary/90">
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="border border-border px-6 py-2 hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map(category => (
                <div key={category.id} className="bg-card p-6 shadow-sm">
                  <h3 className="font-serif text-xl font-semibold text-primary mb-2">{category.name}</h3>
                  <p className="text-muted-foreground text-sm">{category.slug}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-serif text-2xl font-semibold text-primary mb-6">Orders</h2>
            <div className="space-y-4" data-testid="orders-list">
              {orders.map(order => (
                <div key={order.id} className="bg-card p-6 shadow-sm" data-testid={`order-${order.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.order_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-secondary">₹{order.total}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.payment_status}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1">Items:</p>
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {item.product_name} x {item.quantity}
                      </p>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Order Status</label>
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-4 py-2 border border-border rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                      data-testid={`order-status-${order.id}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
