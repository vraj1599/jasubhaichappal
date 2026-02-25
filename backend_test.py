import requests
import sys
import json
from datetime import datetime

class JasubhaiChappalAPITester:
    def __init__(self, base_url="https://jasubhai-craft.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, message="", response_data=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        if response_data:
            result["response"] = response_data
            
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status}: {name} - {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, params=params)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, params=params)
            
            success = response.status_code == expected_status
            message = f"Status: {response.status_code}"
            
            if not success:
                message += f" (Expected: {expected_status})"
                try:
                    error_detail = response.json()
                    message += f" - {error_detail.get('detail', 'No error details')}"
                except:
                    message += f" - {response.text[:200] if response.text else 'No response body'}"
            
            response_data = None
            if success and response.content:
                try:
                    response_data = response.json()
                except:
                    response_data = {"raw": response.text[:200]}
            
            self.log_test(name, success, message, response_data)
            return success, response_data

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, None

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_categories(self):
        """Test category endpoints"""
        print("\n📂 Testing Categories...")
        
        # Get categories
        success, categories = self.run_test("Get Categories", "GET", "categories", 200)
        if not success:
            return False
            
        if not categories or len(categories) == 0:
            self.log_test("Categories Data", False, "No categories found in database")
            return False
        
        self.log_test("Categories Data", True, f"Found {len(categories)} categories")
        
        # Test create category
        test_category = {
            "name": "Test Category",
            "slug": "test-category-" + str(int(datetime.now().timestamp())),
            "description": "Test category description"
        }
        
        success, created_cat = self.run_test("Create Category", "POST", "categories", 200, test_category)
        
        return success

    def test_products(self):
        """Test product endpoints"""
        print("\n👜 Testing Products...")
        
        # Get all products
        success, products = self.run_test("Get All Products", "GET", "products", 200)
        if not success:
            return False
            
        if not products or len(products) == 0:
            self.log_test("Products Data", False, "No products found in database")
            return False
        
        self.log_test("Products Data", True, f"Found {len(products)} products")
        
        # Get featured products
        self.run_test("Get Featured Products", "GET", "products", 200, params={"featured": True})
        
        # Search products
        self.run_test("Search Products", "GET", "products", 200, params={"search": "chappal"})
        
        # Get product by ID
        if products:
            product_id = products[0]["id"]
            self.run_test("Get Product by ID", "GET", f"products/{product_id}", 200)
            
            # Get product by slug
            product_slug = products[0]["slug"]
            self.run_test("Get Product by Slug", "GET", f"products/slug/{product_slug}", 200)
        
        return True

    def test_cart_operations(self):
        """Test cart functionality"""
        print("\n🛒 Testing Cart Operations...")
        
        user_id = "test-guest"
        
        # Get cart
        success, cart = self.run_test("Get Cart", "GET", f"cart/{user_id}", 200)
        if not success:
            return False
        
        # Get products first to add to cart
        success, products = self.run_test("Get Products for Cart", "GET", "products", 200)
        if not success or not products:
            self.log_test("Cart Test Setup", False, "No products available for cart testing")
            return False
        
        product_id = products[0]["id"]
        
        # Add to cart
        cart_item = {
            "product_id": product_id,
            "quantity": 2,
            "size": "7" if products[0].get("sizes") else None,
            "color": "Red" if products[0].get("colors") else None
        }
        
        success, _ = self.run_test("Add to Cart", "POST", f"cart/{user_id}/add", 200, cart_item)
        if not success:
            return False
        
        # Get updated cart
        success, updated_cart = self.run_test("Get Updated Cart", "GET", f"cart/{user_id}", 200)
        if success and updated_cart:
            items_count = len(updated_cart.get("items", []))
            self.log_test("Cart Items Count", items_count > 0, f"Cart has {items_count} items")
        
        # Remove from cart
        params = {}
        if cart_item["size"]:
            params["size"] = cart_item["size"]
        if cart_item["color"]:
            params["color"] = cart_item["color"]
            
        self.run_test("Remove from Cart", "DELETE", f"cart/{user_id}/item/{product_id}", 200, params=params)
        
        # Clear cart
        self.run_test("Clear Cart", "DELETE", f"cart/{user_id}", 200)
        
        return True

    def test_wishlist_operations(self):
        """Test wishlist functionality"""
        print("\n💖 Testing Wishlist Operations...")
        
        user_id = "test-guest"
        
        # Get wishlist
        success, wishlist = self.run_test("Get Wishlist", "GET", f"wishlist/{user_id}", 200)
        if not success:
            return False
        
        # Get products first
        success, products = self.run_test("Get Products for Wishlist", "GET", "products", 200)
        if not success or not products:
            return False
        
        product_id = products[0]["id"]
        
        # Add to wishlist
        wishlist_item = {"product_id": product_id}
        success, _ = self.run_test("Add to Wishlist", "POST", f"wishlist/{user_id}/add", 200, wishlist_item)
        
        # Remove from wishlist
        self.run_test("Remove from Wishlist", "DELETE", f"wishlist/{user_id}/item/{product_id}", 200)
        
        return success

    def test_order_operations(self):
        """Test order functionality"""
        print("\n📦 Testing Order Operations...")
        
        user_id = "test-guest"
        
        # Get products first
        success, products = self.run_test("Get Products for Order", "GET", "products", 200)
        if not success or not products:
            return False
        
        product = products[0]
        
        # Create order
        order_data = {
            "user_id": user_id,
            "items": [{
                "product_id": product["id"],
                "product_name": product["name"],
                "quantity": 1,
                "size": "7",
                "color": "Red",
                "price": product.get("discount_price", product["price"])
            }],
            "shipping_address": {
                "name": "Test User",
                "phone": "9876543210",
                "address_line1": "123 Test Address",
                "city": "Ahmedabad",
                "state": "Gujarat",
                "pincode": "380001"
            },
            "subtotal": product.get("discount_price", product["price"]),
            "discount": 0,
            "total": product.get("discount_price", product["price"])
        }
        
        success, order = self.run_test("Create Order", "POST", "orders/create", 200, order_data)
        if not success:
            return False
        
        order_id = order.get("id") if order else None
        
        if order_id:
            # Get order by ID
            self.run_test("Get Order by ID", "GET", f"orders/{order_id}", 200)
            
            # Get user orders
            self.run_test("Get User Orders", "GET", f"orders/user/{user_id}", 200)
            
            # Get all orders (admin)
            self.run_test("Get All Orders", "GET", "orders", 200)
            
            # Update order status
            self.run_test("Update Order Status", "PUT", f"orders/{order_id}/status", 200, params={"status": "confirmed"})
        
        return True

    def test_reviews(self):
        """Test review functionality"""
        print("\n⭐ Testing Reviews...")
        
        # Get products first
        success, products = self.run_test("Get Products for Reviews", "GET", "products", 200)
        if not success or not products:
            return False
        
        product_id = products[0]["id"]
        
        # Get reviews for product
        self.run_test("Get Product Reviews", "GET", f"reviews/product/{product_id}", 200)
        
        # Create review
        review_data = {
            "product_id": product_id,
            "user_id": "test-guest",
            "user_name": "Test Reviewer",
            "rating": 5,
            "comment": "Excellent product! Love the quality."
        }
        
        self.run_test("Create Review", "POST", "reviews", 200, review_data)
        
        return True

    def test_config_endpoints(self):
        """Test configuration endpoints"""
        print("\n⚙️ Testing Configuration...")
        
        self.run_test("Get Razorpay Config", "GET", "config/razorpay", 200)
        
        return True

    def run_all_tests(self):
        """Run all API tests"""
        print("🧪 Starting Jasubhai Chappal E-commerce API Testing...")
        print("="*60)
        
        # Test order: Critical APIs first
        test_functions = [
            self.test_api_root,
            self.test_categories,
            self.test_products,
            self.test_cart_operations,
            self.test_wishlist_operations,
            self.test_reviews,
            self.test_order_operations,
            self.test_config_endpoints
        ]
        
        for test_func in test_functions:
            try:
                success = test_func()
                if not success:
                    print(f"❌ Critical failure in {test_func.__name__}")
            except Exception as e:
                print(f"❌ Exception in {test_func.__name__}: {e}")
        
        # Print final results
        print("\n" + "="*60)
        print(f"📊 FINAL RESULTS: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate < 50:
            print("🚨 CRITICAL: Less than 50% APIs working - major issues detected")
            return 1
        elif success_rate < 80:
            print("⚠️ WARNING: Some APIs have issues - needs investigation")
            return 1
        else:
            print("✅ GOOD: Most APIs working correctly")
            return 0

def main():
    tester = JasubhaiChappalAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())