import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me?token=${token}`);
          if (response.data.is_admin) {
            navigate('/admin/dashboard');
          }
        } catch (error) {
          localStorage.removeItem('adminToken');
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      
      localStorage.setItem('adminToken', response.data.access_token);
      
      const userResponse = await axios.get(`${API}/auth/me?token=${response.data.access_token}`);
      
      if (!userResponse.data.is_admin) {
        toast.error('Access denied. Admin privileges required.');
        localStorage.removeItem('adminToken');
        return;
      }
      
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-3">
            Admin Login
          </h1>
          <p className="text-muted-foreground text-lg">Jasubhai Chappal Dashboard</p>
        </div>

        <div className="bg-card p-8 shadow-2xl border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="admin@jasubhaichappal.com"
                data-testid="admin-email-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12"
                  placeholder="Enter your password"
                  data-testid="admin-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 hover:bg-primary/90 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              data-testid="admin-login-button"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-accent/20 border border-primary/20 text-sm">
            <p className="font-semibold text-primary mb-2">Default Admin Credentials:</p>
            <p className="text-muted-foreground">📧 Email: admin@jasubhaichappal.com</p>
            <p className="text-muted-foreground">🔑 Password: admin123</p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Change these credentials after first login
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          <a href="/" className="text-primary hover:underline">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
