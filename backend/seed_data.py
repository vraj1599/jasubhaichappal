import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("Seeding database...")
    
    # Clear existing data
    await db.categories.delete_many({})
    await db.products.delete_many({})
    
    # Categories
    categories = [
        {
            "id": "cat-wedding",
            "name": "Wedding Collection",
            "slug": "wedding-collection",
            "description": "Exquisite handcrafted chappals for your special day",
            "image_url": "https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"
        },
        {
            "id": "cat-party",
            "name": "Party Wear",
            "slug": "party-wear",
            "description": "Stylish chappals perfect for parties and celebrations",
            "image_url": "https://images.unsplash.com/photo-1770049770706-6fc82ab583d8"
        },
        {
            "id": "cat-daily",
            "name": "Daily Comfort",
            "slug": "daily-comfort",
            "description": "Comfortable chappals for everyday wear",
            "image_url": "https://images.pexels.com/photos/8477809/pexels-photo-8477809.jpeg"
        },
        {
            "id": "cat-designer",
            "name": "Designer Embroidery",
            "slug": "designer-embroidery",
            "description": "Premium designer chappals with intricate embroidery",
            "image_url": "https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"
        },
        {
            "id": "cat-festive",
            "name": "Festive Special",
            "slug": "festive-special",
            "description": "Vibrant chappals for festive occasions",
            "image_url": "https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"
        }
    ]
    
    await db.categories.insert_many(categories)
    print(f"✓ Created {len(categories)} categories")
    
    # Sample Products
    products = [
        # Wedding Collection
        {
            "id": "prod-wed-1",
            "name": "Royal Bridal Chappal",
            "slug": "royal-bridal-chappal",
            "description": "Stunning bridal chappal with intricate gold embroidery and pearl work. Perfect for your wedding day.",
            "price": 2499,
            "discount_price": 1999,
            "category_id": "cat-wedding",
            "images": ["https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"],
            "sizes": ["5", "6", "7", "8", "9"],
            "colors": ["Red Gold", "Maroon Gold", "Pink Gold"],
            "care_instructions": "Wipe with dry cloth. Keep away from water and direct sunlight.",
            "in_stock": True,
            "stock_quantity": 25,
            "featured": True
        },
        {
            "id": "prod-wed-2",
            "name": "Elegant Wedding Mojari",
            "slug": "elegant-wedding-mojari",
            "description": "Handcrafted mojari with traditional embroidery. Ideal for wedding ceremonies.",
            "price": 1899,
            "discount_price": 1599,
            "category_id": "cat-wedding",
            "images": ["https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"],
            "sizes": ["5", "6", "7", "8", "9"],
            "colors": ["Red", "Maroon", "Golden"],
            "care_instructions": "Dry clean only. Store in cool, dry place.",
            "in_stock": True,
            "stock_quantity": 30,
            "featured": True
        },
        # Party Wear
        {
            "id": "prod-party-1",
            "name": "Glamorous Party Heels",
            "slug": "glamorous-party-heels",
            "description": "Stylish party wear chappal with comfortable heel. Stand out at any celebration.",
            "price": 1299,
            "discount_price": 999,
            "category_id": "cat-party",
            "images": ["https://images.unsplash.com/photo-1770049770706-6fc82ab583d8"],
            "sizes": ["5", "6", "7", "8"],
            "colors": ["Silver", "Gold", "Black"],
            "care_instructions": "Wipe with soft cloth. Avoid prolonged exposure to moisture.",
            "in_stock": True,
            "stock_quantity": 40,
            "featured": True
        },
        {
            "id": "prod-party-2",
            "name": "Sparkle Festive Chappal",
            "slug": "sparkle-festive-chappal",
            "description": "Eye-catching chappal with sparkle details. Perfect for parties and functions.",
            "price": 1499,
            "discount_price": 1199,
            "category_id": "cat-party",
            "images": ["https://images.unsplash.com/photo-1770049770706-6fc82ab583d8"],
            "sizes": ["5", "6", "7", "8", "9"],
            "colors": ["Silver", "Rose Gold", "Champagne"],
            "care_instructions": "Handle with care. Store in dust bag when not in use.",
            "in_stock": True,
            "stock_quantity": 35,
            "featured": False
        },
        # Daily Comfort
        {
            "id": "prod-daily-1",
            "name": "Comfort Daily Sandal",
            "slug": "comfort-daily-sandal",
            "description": "Ultra-comfortable chappal for everyday wear. Soft cushioning for all-day comfort.",
            "price": 699,
            "discount_price": 549,
            "category_id": "cat-daily",
            "images": ["https://images.pexels.com/photos/8477809/pexels-photo-8477809.jpeg"],
            "sizes": ["5", "6", "7", "8", "9", "10"],
            "colors": ["Brown", "Tan", "Black"],
            "care_instructions": "Easy to clean. Wash with mild soap and water.",
            "in_stock": True,
            "stock_quantity": 50,
            "featured": True
        },
        {
            "id": "prod-daily-2",
            "name": "Classic Everyday Chappal",
            "slug": "classic-everyday-chappal",
            "description": "Simple yet elegant chappal for daily use. Durable and comfortable.",
            "price": 599,
            "discount_price": None,
            "category_id": "cat-daily",
            "images": ["https://images.pexels.com/photos/8477809/pexels-photo-8477809.jpeg"],
            "sizes": ["5", "6", "7", "8", "9"],
            "colors": ["Beige", "Brown", "Grey"],
            "care_instructions": "Machine washable. Air dry in shade.",
            "in_stock": True,
            "stock_quantity": 60,
            "featured": False
        },
        # Designer Embroidery
        {
            "id": "prod-designer-1",
            "name": "Premium Embroidered Chappal",
            "slug": "premium-embroidered-chappal",
            "description": "Luxurious chappal with hand-embroidered motifs. A true work of art.",
            "price": 3499,
            "discount_price": 2799,
            "category_id": "cat-designer",
            "images": ["https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"],
            "sizes": ["5", "6", "7", "8"],
            "colors": ["Royal Blue", "Emerald Green", "Deep Purple"],
            "care_instructions": "Handle with extreme care. Dry clean recommended.",
            "in_stock": True,
            "stock_quantity": 15,
            "featured": True
        },
        {
            "id": "prod-designer-2",
            "name": "Artistic Thread Work Sandal",
            "slug": "artistic-thread-work-sandal",
            "description": "Exquisite thread work design. Perfect for special occasions.",
            "price": 2999,
            "discount_price": 2499,
            "category_id": "cat-designer",
            "images": ["https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"],
            "sizes": ["5", "6", "7", "8", "9"],
            "colors": ["Peacock Blue", "Wine Red", "Golden Yellow"],
            "care_instructions": "Professional cleaning recommended. Store carefully.",
            "in_stock": True,
            "stock_quantity": 20,
            "featured": False
        },
        # Festive Special
        {
            "id": "prod-festive-1",
            "name": "Diwali Special Chappal",
            "slug": "diwali-special-chappal",
            "description": "Vibrant festive chappal with traditional mirror work. Celebrate in style!",
            "price": 1799,
            "discount_price": 1399,
            "category_id": "cat-festive",
            "images": ["https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"],
            "sizes": ["5", "6", "7", "8", "9"],
            "colors": ["Orange", "Red", "Yellow"],
            "care_instructions": "Spot clean only. Avoid water contact.",
            "in_stock": True,
            "stock_quantity": 30,
            "featured": True
        },
        {
            "id": "prod-festive-2",
            "name": "Navratri Dance Sandal",
            "slug": "navratri-dance-sandal",
            "description": "Colorful and comfortable sandal perfect for Garba and Dandiya nights.",
            "price": 1299,
            "discount_price": 999,
            "category_id": "cat-festive",
            "images": ["https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg"],
            "sizes": ["5", "6", "7", "8", "9"],
            "colors": ["Multicolor", "Pink Purple", "Green Yellow"],
            "care_instructions": "Wipe clean. Store in original packaging.",
            "in_stock": True,
            "stock_quantity": 45,
            "featured": False
        }
    ]
    
    await db.products.insert_many(products)
    print(f"✓ Created {len(products)} products")
    
    print("✓ Database seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
