from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import razorpay
from enum import Enum
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Body

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_client = razorpay.Client(auth=(os.environ.get('RAZORPAY_KEY_ID', ''), os.environ.get('RAZORPAY_KEY_SECRET', '')))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jasubhai-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

# Models
class PhoneAuthRequest(BaseModel):
    name: str
    phone: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    password: str
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    price: float
    discount_price: Optional[float] = None
    category_id: str
    images: List[str] = []
    sizes: List[str] = []
    colors: List[str] = []
    care_instructions: Optional[str] = None
    in_stock: bool = True
    stock_quantity: int = 0
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str
    price: float
    discount_price: Optional[float] = None
    category_id: str
    images: List[str] = []
    sizes: List[str] = []
    colors: List[str] = []
    care_instructions: Optional[str] = None
    stock_quantity: int = 0
    featured: bool = False

class CartItem(BaseModel):
    product_id: str
    quantity: int
    size: Optional[str] = None
    color: Optional[str] = None

class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[CartItem] = []
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WishlistItem(BaseModel):
    product_id: str

class Wishlist(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[WishlistItem] = []

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    user_id: str
    user_name: str
    rating: int
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    product_id: str
    user_id: str
    user_name: str
    rating: int
    comment: str

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    size: Optional[str] = None
    color: Optional[str] = None
    price: float

class ShippingAddress(BaseModel):
    name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=lambda: f"ORD{uuid.uuid4().hex[:8].upper()}")
    user_id: str
    items: List[OrderItem]
    shipping_address: ShippingAddress
    subtotal: float
    discount: float = 0
    total: float
    payment_status: PaymentStatus = PaymentStatus.PENDING
    order_status: OrderStatus = OrderStatus.PENDING
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    user_id: str
    items: List[OrderItem]
    shipping_address: ShippingAddress
    subtotal: float
    discount: float = 0
    total: float

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: str

class Token(BaseModel):
    access_token: str
    token_type: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

# Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        user = await db.users.find_one({"email": email}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# Routes
@api_router.get("/")
async def root():
    return {"message": "Jasubhai Chappal API"}

#user registration
@api_router.post("/phone-login", response_model=Token)
async def phone_login(data: PhoneAuthRequest):

    # 1️⃣ Check if user exists by phone
    user = await db.users.find_one({"phone": data.phone}, {"_id": 0})

    if not user:
        # 2️⃣ Create new user automatically

        dummy_email = f"{data.phone}@jasubhai.com"
        dummy_password = get_password_hash(data.phone)  # using phone as password

        new_user = User(
            name=data.name,
            email=dummy_email,
            phone=data.phone,
            password=dummy_password,
            is_admin=False
        )

        doc = new_user.model_dump()
        doc["created_at"] = doc["created_at"].isoformat()

        await db.users.insert_one(doc)
        user = doc

    # 3️⃣ Create JWT token (IMPORTANT: use email because your auth uses email)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "is_admin": user.get("is_admin", False)},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@api_router.post("/admin/login", response_model=Token)
async def admin_login(admin_data: AdminLogin = Body(...)):
    """
    Admin login with static credentials.
    """
    STATIC_ADMIN_EMAIL = "admin@jasubhaichappal.com"
    STATIC_ADMIN_PASSWORD = "admin123"

    if admin_data.email != STATIC_ADMIN_EMAIL or admin_data.password != STATIC_ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Generate JWT token for admin
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": STATIC_ADMIN_EMAIL, "is_admin": True},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

# ========== AUTHENTICATION ROUTES ==========
@api_router.post("/auth/login", response_model=Token)
async def login(login_data: AdminLogin):
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "is_admin": user.get("is_admin", False)},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me")
async def get_current_user_info(token: str = Query(...)):
    user = await get_current_user(token)
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "is_admin": user.get("is_admin", False)
    }

@api_router.post("/auth/create-admin")
async def create_default_admin():
    """Create default admin user"""
    existing = await db.users.find_one({"email": "admin@jasubhaichappal.com"}, {"_id": 0})
    if existing:
        return {"message": "Admin already exists", "email": "admin@jasubhaichappal.com"}
    
    admin = User(
        name="Admin",
        email="admin@jasubhaichappal.com",
        phone="9876543210",
        password=get_password_hash("admin123"),
        is_admin=True
    )
    doc = admin.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    return {
        "message": "Admin created successfully",
        "email": "admin@jasubhaichappal.com",
        "password": "admin123"
    }

# Category Routes
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
    return categories

@api_router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate):
    existing = await db.categories.find_one({"slug": category.slug}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    
    category_obj = Category(**category.model_dump())
    await db.categories.insert_one(category_obj.model_dump())
    return category_obj

# Product Routes
@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(100)

    formatted_products = []

    for p in products:
        formatted_products.append({
            "id": p.get("id"),
            "name": p.get("name"),
            "slug": p.get("slug") or p.get("name", "").lower().replace(" ", "-"),
            "description": p.get("description"),
            "price": p.get("price"),
            "discount_price": p.get("discount_price"),
            "category_id": p.get("category_id") or "default-category",
            "images": p.get("images", []),
            "sizes": p.get("sizes", []),
            "colors": p.get("colors", []),
            "care_instructions": p.get("care_instructions"),
            "in_stock": p.get("stock", 0) > 0,
            "stock_quantity": p.get("stock") or p.get("stock_quantity", 0),
            "featured": p.get("featured", False),
            "created_at": (
                datetime.fromisoformat(p["created_at"])
                if isinstance(p.get("created_at"), str)
                else p.get("created_at")
            ),
        })

    return formatted_products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/products/slug/{slug}", response_model=Product)
async def get_product_by_slug(slug: str):
    product = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    existing = await db.products.find_one({"slug": product.slug}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")
    
    product_obj = Product(**product.model_dump(), in_stock=product.stock_quantity > 0)
    await db.products.insert_one(product_obj.model_dump())
    return product_obj

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate):
    existing = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_dict = product.model_dump()
    product_dict["in_stock"] = product.stock_quantity > 0
    product_dict["updated_at"] = datetime.now(timezone.utc)
    
    await db.products.update_one({"id": product_id}, {"$set": product_dict})
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Cart Routes
@api_router.get("/cart/{user_id}", response_model=Cart)
async def get_cart(user_id: str):
    cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    if not cart:
        cart = Cart(user_id=user_id)
        await db.carts.insert_one(cart.model_dump())
    return cart

@api_router.post("/cart/{user_id}/add")
async def add_to_cart(user_id: str, item: CartItem):
    cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    if not cart:
        cart = Cart(user_id=user_id, items=[item.model_dump()])
        await db.carts.insert_one(cart.model_dump())
    else:
        items = cart.get("items", [])
        existing_item = None
        for i, cart_item in enumerate(items):
            if (cart_item["product_id"] == item.product_id and 
                cart_item.get("size") == item.size and 
                cart_item.get("color") == item.color):
                existing_item = i
                break
        
        if existing_item is not None:
            items[existing_item]["quantity"] += item.quantity
        else:
            items.append(item.model_dump())
        
        await db.carts.update_one(
            {"user_id": user_id},
            {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    return {"message": "Item added to cart"}

@api_router.delete("/cart/{user_id}/item/{product_id}")
async def remove_from_cart(user_id: str, product_id: str, size: Optional[str] = None, color: Optional[str] = None):
    cart = await db.carts.find_one({"user_id": user_id}, {"_id": 0})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    items = cart.get("items", [])
    items = [item for item in items if not (
        item["product_id"] == product_id and 
        item.get("size") == size and 
        item.get("color") == color
    )]
    
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Item removed from cart"}

@api_router.delete("/cart/{user_id}")
async def clear_cart(user_id: str):
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": {"items": [], "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Cart cleared"}

# Wishlist Routes
@api_router.get("/wishlist/{user_id}", response_model=Wishlist)
async def get_wishlist(user_id: str):
    wishlist = await db.wishlists.find_one({"user_id": user_id}, {"_id": 0})
    if not wishlist:
        wishlist = Wishlist(user_id=user_id)
        await db.wishlists.insert_one(wishlist.model_dump())
    return wishlist

@api_router.post("/wishlist/{user_id}/add")
async def add_to_wishlist(user_id: str, item: WishlistItem):
    wishlist = await db.wishlists.find_one({"user_id": user_id}, {"_id": 0})
    if not wishlist:
        wishlist = Wishlist(user_id=user_id, items=[item.model_dump()])
        await db.wishlists.insert_one(wishlist.model_dump())
    else:
        items = wishlist.get("items", [])
        if not any(i["product_id"] == item.product_id for i in items):
            items.append(item.model_dump())
            await db.wishlists.update_one(
                {"user_id": user_id},
                {"$set": {"items": items}}
            )
    
    return {"message": "Item added to wishlist"}

@api_router.delete("/wishlist/{user_id}/item/{product_id}")
async def remove_from_wishlist(user_id: str, product_id: str):
    wishlist = await db.wishlists.find_one({"user_id": user_id}, {"_id": 0})
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    
    items = wishlist.get("items", [])
    items = [item for item in items if item["product_id"] != product_id]
    
    await db.wishlists.update_one(
        {"user_id": user_id},
        {"$set": {"items": items}}
    )
    
    return {"message": "Item removed from wishlist"}

# Review Routes
@api_router.get("/reviews/product/{product_id}", response_model=List[Review])
async def get_product_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).to_list(1000)
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    review_obj = Review(**review.model_dump())
    doc = review_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reviews.insert_one(doc)
    return review_obj

# Order Routes
@api_router.post("/orders/create", response_model=Order)
async def create_order(order: OrderCreate):
    # Create Razorpay order
    amount = int(order.total * 100)  # Convert to paise
    try:
        razorpay_order = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1
        })
    except Exception as e:
        # If Razorpay is not configured, continue without it
        razorpay_order = {"id": None}
    
    order_obj = Order(**order.model_dump(), razorpay_order_id=razorpay_order.get("id"))
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.orders.insert_one(doc)
    
    return order_obj

@api_router.post("/orders/verify-payment")
async def verify_payment(payment: PaymentVerification):
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': payment.razorpay_order_id,
            'razorpay_payment_id': payment.razorpay_payment_id,
            'razorpay_signature': payment.razorpay_signature
        })
        
        # Update order status
        await db.orders.update_one(
            {"id": payment.order_id},
            {"$set": {
                "payment_status": PaymentStatus.COMPLETED.value,
                "order_status": OrderStatus.CONFIRMED.value,
                "razorpay_payment_id": payment.razorpay_payment_id,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return {"message": "Payment verified successfully"}
    except Exception as e:
        await db.orders.update_one(
            {"id": payment.order_id},
            {"$set": {
                "payment_status": PaymentStatus.FAILED.value,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        raise HTTPException(status_code=400, detail="Payment verification failed")

@api_router.get("/orders/user/{user_id}", response_model=List[Order])
async def get_user_orders(user_id: str):
    orders = await db.orders.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
        if isinstance(order.get('updated_at'), str):
            order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    if isinstance(order.get('updated_at'), str):
        order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_all_orders():
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
        if isinstance(order.get('updated_at'), str):
            order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    return orders

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: OrderStatus):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"order_status": status.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"}

# Get Razorpay Key for frontend
@api_router.get("/config/razorpay")
async def get_razorpay_key():
    return {"key_id": os.environ.get('RAZORPAY_KEY_ID', '')}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
