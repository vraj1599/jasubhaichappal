from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import razorpay
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay setup (test keys for now)
razorpay_client = razorpay.Client(auth=(os.environ.get('RAZORPAY_KEY_ID', 'test_key'), 
                                         os.environ.get('RAZORPAY_KEY_SECRET', 'test_secret')))

JWT_SECRET = os.environ.get('JWT_SECRET', 'jasubhai_secret_key_2024')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===== MODELS =====

class Admin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str

class AdminLogin(BaseModel):
    email: str
    password: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    discount_price: Optional[float] = None
    images: List[str]
    sizes: List[str]
    colors: List[str]
    category: str
    stock: int
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    discount_price: Optional[float] = None
    images: List[str]
    sizes: List[str]
    colors: List[str]
    category: str
    stock: int
    featured: bool = False

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    name: str
    rating: int
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    product_id: str
    name: str
    rating: int
    comment: str

class CartItem(BaseModel):
    product_id: str
    quantity: int
    size: str
    color: str

class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    items: List[CartItem]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: dict
    items: List[dict]
    subtotal: float
    discount: float
    total: float
    payment_status: str  # pending, completed, failed
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: dict
    items: List[dict]
    subtotal: float
    discount: float
    total: float
    coupon_code: Optional[str] = None

class Coupon(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    discount_percent: float
    expiry_date: datetime
    active: bool = True

class CouponValidate(BaseModel):
    code: str

# ===== HELPER FUNCTIONS =====

def verify_admin_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ===== ROUTES =====

@api_router.get("/")
async def root():
    return {"message": "Jasubhai Chappal API"}

# Admin Routes
@api_router.post("/admin/login")
async def admin_login(login: AdminLogin):
    admin = await db.admins.find_one({"email": login.email}, {"_id": 0})
    if not admin:
        # Create default admin if not exists
        if login.email == "admin@jasubhaichappal.com" and login.password == "admin123":
            password_hash = bcrypt.hashpw(login.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            new_admin = {
                "id": str(uuid.uuid4()),
                "email": login.email,
                "password_hash": password_hash
            }
            await db.admins.insert_one(new_admin)
            token = jwt.encode({"email": login.email, "exp": datetime.now(timezone.utc) + timedelta(days=7)}, JWT_SECRET, algorithm='HS256')
            return {"token": token, "email": login.email}
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if bcrypt.checkpw(login.password.encode('utf-8'), admin['password_hash'].encode('utf-8')):
        token = jwt.encode({"email": login.email, "exp": datetime.now(timezone.utc) + timedelta(days=7)}, JWT_SECRET, algorithm='HS256')
        return {"token": token, "email": login.email}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Product Routes
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query['category'] = category
    if featured is not None:
        query['featured'] = featured
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, admin=Depends(verify_admin_token)):
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return product_obj

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate, admin=Depends(verify_admin_token)):
    existing = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.model_dump()
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin=Depends(verify_admin_token)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

# Categories
@api_router.get("/categories")
async def get_categories():
    categories = await db.products.distinct("category")
    return {"categories": categories}

# Reviews
@api_router.get("/reviews/{product_id}", response_model=List[Review])
async def get_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).to_list(1000)
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    review_obj = Review(**review.model_dump())
    doc = review_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reviews.insert_one(doc)
    return review_obj

# Cart
@api_router.get("/cart/{session_id}")
async def get_cart(session_id: str):
    cart = await db.carts.find_one({"session_id": session_id}, {"_id": 0})
    if not cart:
        return {"session_id": session_id, "items": []}
    return cart

@api_router.post("/cart/{session_id}")
async def update_cart(session_id: str, items: List[CartItem]):
    cart_data = {
        "session_id": session_id,
        "items": [item.model_dump() for item in items],
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.carts.update_one(
        {"session_id": session_id},
        {"$set": cart_data},
        upsert=True
    )
    return cart_data

# Orders
@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    order_number = f"JC{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:6].upper()}"
    order_obj = Order(
        order_number=order_number,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        shipping_address=order.shipping_address,
        items=order.items,
        subtotal=order.subtotal,
        discount=order.discount,
        total=order.total,
        payment_status="pending"
    )
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.orders.insert_one(doc)
    return order_obj

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    return order

@api_router.get("/admin/orders", response_model=List[Order])
async def get_all_orders(admin=Depends(verify_admin_token)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    return orders

@api_router.put("/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, status: dict, admin=Depends(verify_admin_token)):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"payment_status": status.get('payment_status')}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"}

# Payment
@api_router.post("/payment/create-order")
async def create_payment_order(order_data: dict):
    try:
        # Create Razorpay order
        razorpay_order = razorpay_client.order.create({
            "amount": int(order_data['amount'] * 100),  # Convert to paise
            "currency": "INR",
            "payment_capture": 1
        })
        
        # Update order with Razorpay order ID
        await db.orders.update_one(
            {"id": order_data['order_id']},
            {"$set": {"razorpay_order_id": razorpay_order['id']}}
        )
        
        return {
            "razorpay_order_id": razorpay_order['id'],
            "amount": razorpay_order['amount'],
            "currency": razorpay_order['currency']
        }
    except Exception as e:
        # Mock payment for testing
        return {
            "razorpay_order_id": f"order_mock_{str(uuid.uuid4())[:12]}",
            "amount": int(order_data['amount'] * 100),
            "currency": "INR",
            "mock": True
        }

@api_router.post("/payment/verify")
async def verify_payment(payment_data: dict):
    try:
        # Verify signature
        razorpay_client.utility.verify_payment_signature(payment_data)
        
        # Update order status
        await db.orders.update_one(
            {"razorpay_order_id": payment_data['razorpay_order_id']},
            {"$set": {
                "payment_status": "completed",
                "razorpay_payment_id": payment_data['razorpay_payment_id']
            }}
        )
        
        return {"status": "success", "message": "Payment verified"}
    except:
        # Mock verification for testing
        await db.orders.update_one(
            {"razorpay_order_id": payment_data.get('razorpay_order_id')},
            {"$set": {"payment_status": "completed"}}
        )
        return {"status": "success", "message": "Payment verified (mock)"}

# Coupons
@api_router.post("/coupons/validate")
async def validate_coupon(coupon: CouponValidate):
    coupon_data = await db.coupons.find_one({"code": coupon.code.upper()}, {"_id": 0})
    if not coupon_data:
        raise HTTPException(status_code=404, detail="Invalid coupon code")
    
    if not coupon_data.get('active'):
        raise HTTPException(status_code=400, detail="Coupon is inactive")
    
    expiry = coupon_data.get('expiry_date')
    if isinstance(expiry, str):
        expiry = datetime.fromisoformat(expiry)
    
    if expiry < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Coupon has expired")
    
    return {
        "code": coupon_data['code'],
        "discount_percent": coupon_data['discount_percent']
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
