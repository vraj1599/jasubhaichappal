import asyncio
import sys
sys.path.append('/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path('/app/backend')
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

sample_products = [
    {
        "id": str(uuid.uuid4()),
        "name": "Royal Wedding Embroidered Chappal",
        "description": "Exquisite handcrafted wedding chappal with intricate gold embroidery. Perfect for your special day.",
        "price": 2499,
        "discount_price": 1999,
        "images": [
            "https://images.unsplash.com/photo-1769103948746-8592931bbdad?crop=entropy&cs=srgb&fm=jpg",
            "https://images.pexels.com/photos/28834219/pexels-photo-28834219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        ],
        "sizes": ["5", "6", "7", "8", "9", "10"],
        "colors": ["Gold", "Silver", "Rose Gold"],
        "category": "Wedding",
        "stock": 50,
        "featured": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Festive Fancy Kolhapuri Chappal",
        "description": "Traditional Kolhapuri style with a modern twist. Comfortable and stylish for festive occasions.",
        "price": 1799,
        "discount_price": 1499,
        "images": [
            "https://images.unsplash.com/photo-1758120221783-5741d0b35096?crop=entropy&cs=srgb&fm=jpg",
            "https://images.pexels.com/photos/7579468/pexels-photo-7579468.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        ],
        "sizes": ["5", "6", "7", "8", "9"],
        "colors": ["Maroon", "Red", "Pink"],
        "category": "Festive",
        "stock": 40,
        "featured": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Party Wear Sequin Chappal",
        "description": "Glamorous sequin work perfect for parties and celebrations. Comfortable heel height.",
        "price": 1599,
        "discount_price": 1299,
        "images": [
            "https://images.pexels.com/photos/28834219/pexels-photo-28834219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.unsplash.com/photo-1769103948746-8592931bbdad?crop=entropy&cs=srgb&fm=jpg"
        ],
        "sizes": ["5", "6", "7", "8", "9"],
        "colors": ["Gold", "Silver", "Black"],
        "category": "Party",
        "stock": 60,
        "featured": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Daily Wear Comfort Chappal",
        "description": "Soft cushioned sole for all-day comfort. Perfect for everyday wear.",
        "price": 999,
        "discount_price": 799,
        "images": [
            "https://images.pexels.com/photos/7579468/pexels-photo-7579468.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.unsplash.com/photo-1758120221783-5741d0b35096?crop=entropy&cs=srgb&fm=jpg"
        ],
        "sizes": ["5", "6", "7", "8", "9", "10"],
        "colors": ["Brown", "Beige", "Cream"],
        "category": "Daily",
        "stock": 100,
        "featured": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Designer Floral Chappal",
        "description": "Beautiful floral embellishments with hand-stitched details. Ideal for special occasions.",
        "price": 2199,
        "discount_price": 1799,
        "images": [
            "https://images.unsplash.com/photo-1769103948746-8592931bbdad?crop=entropy&cs=srgb&fm=jpg",
            "https://images.pexels.com/photos/28834219/pexels-photo-28834219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        ],
        "sizes": ["5", "6", "7", "8", "9"],
        "colors": ["Pink", "Peach", "Lavender"],
        "category": "Designer",
        "stock": 30,
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Traditional Mojari Style Chappal",
        "description": "Classic Mojari design with authentic Gujarati craftsmanship.",
        "price": 1899,
        "discount_price": 1599,
        "images": [
            "https://images.pexels.com/photos/7579468/pexels-photo-7579468.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.unsplash.com/photo-1758120221783-5741d0b35096?crop=entropy&cs=srgb&fm=jpg"
        ],
        "sizes": ["5", "6", "7", "8", "9"],
        "colors": ["Red", "Green", "Yellow"],
        "category": "Festive",
        "stock": 45,
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pearl Embellished Bridal Chappal",
        "description": "Luxurious pearl work with golden threads. A perfect choice for brides.",
        "price": 3499,
        "discount_price": 2999,
        "images": [
            "https://images.unsplash.com/photo-1769103948746-8592931bbdad?crop=entropy&cs=srgb&fm=jpg",
            "https://images.pexels.com/photos/28834219/pexels-photo-28834219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        ],
        "sizes": ["5", "6", "7", "8", "9"],
        "colors": ["White", "Ivory", "Champagne"],
        "category": "Wedding",
        "stock": 25,
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Casual Boho Chappal",
        "description": "Trendy bohemian style perfect for casual outings and beach trips.",
        "price": 899,
        "discount_price": 699,
        "images": [
            "https://images.pexels.com/photos/7579468/pexels-photo-7579468.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.unsplash.com/photo-1758120221783-5741d0b35096?crop=entropy&cs=srgb&fm=jpg"
        ],
        "sizes": ["5", "6", "7", "8", "9", "10"],
        "colors": ["Tan", "Olive", "Navy"],
        "category": "Daily",
        "stock": 80,
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

sample_coupons = [
    {
        "id": str(uuid.uuid4()),
        "code": "WELCOME10",
        "discount_percent": 10,
        "expiry_date": datetime(2026, 12, 31, 23, 59, 59, tzinfo=timezone.utc).isoformat(),
        "active": True
    },
    {
        "id": str(uuid.uuid4()),
        "code": "FESTIVE20",
        "discount_percent": 20,
        "expiry_date": datetime(2026, 12, 31, 23, 59, 59, tzinfo=timezone.utc).isoformat(),
        "active": True
    }
]

async def seed_database():
    try:
        # Clear existing products and coupons
        await db.products.delete_many({})
        await db.coupons.delete_many({})
        
        # Insert sample data
        await db.products.insert_many(sample_products)
        await db.coupons.insert_many(sample_coupons)
        
        print(f"✅ Successfully seeded {len(sample_products)} products")
        print(f"✅ Successfully seeded {len(sample_coupons)} coupons")
        print("\nCoupon codes:")
        for coupon in sample_coupons:
            print(f"  - {coupon['code']}: {coupon['discount_percent']}% off")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
