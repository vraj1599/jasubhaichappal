import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogOut, Package, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    images: '',
    sizes: '',
    colors: '',
    category: '',
    stock: '',
    featured: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${API}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/products`),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('admin_token');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({ ...productForm, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      discount_price: '',
      images: '',
      sizes: '',
      colors: '',
      category: '',
      stock: '',
      featured: false,
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      images: product.images.join(', '),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
    });
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('admin_token');
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        images: productForm.images.split(',').map((img) => img.trim()),
        sizes: productForm.sizes.split(',').map((size) => size.trim()),
        colors: productForm.colors.split(',').map((color) => color.trim()),
        category: productForm.category,
        stock: parseInt(productForm.stock),
        featured: productForm.featured,
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API}/products`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product added successfully');
      }

      setShowProductForm(false);
      loadData();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete product');
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold" data-testid="admin-dashboard-title">
            Admin Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">Products ({products.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="bg-white rounded-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="orders-table">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left font-body font-semibold text-foreground">Order #</th>
                      <th className="px-6 py-4 text-left font-body font-semibold text-foreground">Customer</th>
                      <th className="px-6 py-4 text-left font-body font-semibold text-foreground">Total</th>
                      <th className="px-6 py-4 text-left font-body font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-left font-body font-semibold text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id} className="border-t border-border" data-testid={`order-row-${index}`}>
                        <td className="px-6 py-4 font-body text-foreground">{order.order_number}</td>
                        <td className="px-6 py-4 font-body text-foreground">{order.customer_name}</td>
                        <td className="px-6 py-4 font-body font-semibold text-primary">₹{order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              order.payment_status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-body text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="mb-6">
              <Button
                onClick={handleAddProduct}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                data-testid="add-product-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <div className="bg-white p-6 rounded-sm border border-border mb-6">
                <h3 className="font-heading text-xl text-primary font-bold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={handleSubmitProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        required
                        data-testid="product-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        name="category"
                        value={productForm.category}
                        onChange={handleProductFormChange}
                        required
                        data-testid="product-category-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={handleProductFormChange}
                        required
                        data-testid="product-price-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount_price">Discount Price</Label>
                      <Input
                        id="discount_price"
                        name="discount_price"
                        type="number"
                        step="0.01"
                        value={productForm.discount_price}
                        onChange={handleProductFormChange}
                        data-testid="product-discount-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={productForm.stock}
                        onChange={handleProductFormChange}
                        required
                        data-testid="product-stock-input"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={productForm.featured}
                        onChange={handleProductFormChange}
                        className="w-4 h-4"
                        data-testid="product-featured-checkbox"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      data-testid="product-description-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="images">Image URLs (comma-separated) *</Label>
                    <Input
                      id="images"
                      name="images"
                      value={productForm.images}
                      onChange={handleProductFormChange}
                      required
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      data-testid="product-images-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sizes">Sizes (comma-separated) *</Label>
                      <Input
                        id="sizes"
                        name="sizes"
                        value={productForm.sizes}
                        onChange={handleProductFormChange}
                        required
                        placeholder="5, 6, 7, 8, 9"
                        data-testid="product-sizes-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="colors">Colors (comma-separated) *</Label>
                      <Input
                        id="colors"
                        name="colors"
                        value={productForm.colors}
                        onChange={handleProductFormChange}
                        required
                        placeholder="Red, Blue, Gold"
                        data-testid="product-colors-input"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                      data-testid="save-product-button"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowProductForm(false)}
                      className="rounded-full"
                      data-testid="cancel-product-button"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div key={product.id} className="bg-white rounded-sm border border-border overflow-hidden" data-testid={`product-card-${index}`}>
                  <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-body font-semibold text-foreground mb-2">{product.name}</h3>
                    <p className="font-body font-bold text-primary mb-2">₹{product.price}</p>
                    <p className="font-body text-sm text-muted-foreground mb-4">Stock: {product.stock}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditProduct(product)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        data-testid={`edit-product-${index}`}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        size="sm"
                        variant="destructive"
                        data-testid={`delete-product-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
