import requests
import os
import psycopg2
from supabase import create_client, Client
from urllib.parse import urlparse

# --- CONFIGURATION ---

SUPABASE_URL = "https://wmhidpsitmleveitrtju.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaGlkcHNpdG1sZXZlaXRydGp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODYyODg5OSwiZXhwIjoyMDY0MjA0ODk5fQ.Tn-HQg8ih_kBp6CVbqxkJNpsDRLhw-X9qQ0K_rjt1h0"
BUCKET_NAME = "wedding-registry-product-images"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Neon (Postgres)
import urllib.parse as up
DATABASE_URL = os.environ.get("DATABASE_URL") or "postgresql://neondb_owner:npg_qnaTE8F4eNXG@ep-square-math-a50vdl7g-pooler.us-east-2.aws.neon.tech/wedding_registry?sslmode=require"
up.uses_netloc.append("postgres")
url = up.urlparse(DATABASE_URL)
conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)
cur = conn.cursor()

# Example product details (replace with your actual data or loop over a list)
"""     {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/58/4973192/1.jpg?7426",
        "price": 40000,
        "name": "Better Homes 16-Piece Dinner Set",
        "description": "Better Homes 16-Piece Dinner Set"
    }, """
product_details = [
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/47/7680883/1.jpg?8793",
        "price": 58900,
        "name": "Solid Stoneware Dinner Plate Set 16pcs",
        "description": "Solid Stoneware Dinner Plate Set 16pcs"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/50/9558804/1.jpg?6135",
        "price": 58900,
        "name": "Solid Stoneware Dinner Plate Set 16pcs",
        "description": "Solid Stoneware Dinner Plate Set 16pcs"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/89/608593/1.jpg?9059",
        "price": 49500,
        "name": "16 Pieces Dinner Set",
        "description": "16 Pieces Dinner Set"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/44/9917963/1.jpg?7924",
        "price": 11000,
        "name": "Tequila Shot Glasses, 12 Pieces",
        "description": "Tequila Shot Glasses, 12 Pieces"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/84/9107893/3.jpg?7497",
        "price": 27280,
        "name": "SILVER CREST 2L Industrial 8500W Food Crusher Blender With 2 Jar",
        "description": "SILVER CREST 2L Industrial 8500W Food Crusher Blender With 2 Jar"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/37/4538504/1.jpg?3187",
        "price": 58356,
        "name": "TINMO Airfryer 10L Volume, 8L Storage Capacity, Model (OLM-KZB006) 1400W+ 12 Months Warranty",
        "description": "TINMO Airfryer 10L Volume, 8L Storage Capacity, Model (OLM-KZB006) 1400W+ 12 Months Warranty"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/45/8722904/1.jpg?9421",
        "price": 35305,
        "name": "Binatone 1.5 Litres Blender With Grinder 300W (BLG-410) - White + 2 Years Warranty",
        "description": "Binatone 1.5 Litres Blender With Grinder 300W (BLG-410) - White + 2 Years Warranty"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/19/2293473/1.jpg?2207",
        "price": 72626,
        "name": "Glamstar 20 Litres Analog Microwave (GMW-20LMX7-B(B)) - Black",
        "description": "Glamstar 20 Litres Analog Microwave (GMW-20LMX7-B(B)) - Black"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/07/3190262/1.jpg?2427",
        "price": 96555,
        "name": "Haier Thermocool 20 Litres Manual Microwave (MM20BB01) -Black + 1 Year Warranty",
        "description": "Haier Thermocool 20 Litres Manual Microwave (MM20BB01) -Black + 1 Year Warranty"
    },
    {
        "category": "Kitchen & Dining",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/43/3529804/1.jpg?4510",
        "price": 44776,
        "name": "SILVER CREST 6L Extra Large Capacity Digital AirFryer",
        "description": "SILVER CREST 6L Extra Large Capacity Digital AirFryer"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/26/2019153/1.jpg?3805",
        "price": 42000,
        "name": "Black White Center Table-Coffee Table Home Furniture",
        "description": "Black White Center Table-Coffee Table Home Furniture"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/47/939736/1.jpg?8513",
        "price": 53000,
        "name": "3 In 1 Center Table Plus Two Detachable Side Tables",
        "description": "3 In 1 Center Table Plus Two Detachable Side Tables"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/05/5121522/1.jpg?1659",
        "price": 260000,
        "name": "Dining Room Table With 4 Leather Chairs",
        "description": "Dining Room Table With 4 Leather Chairs"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/44/2636301/1.jpg?4094",
        "price": 136000,
        "name": "Nexus 32 Inches FHD TV (H620B(SA) - Black + 2 Years Warranty",
        "description": "Nexus 32 Inches FHD TV (H620B(SA) - Black + 2 Years Warranty"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/67/4471583/4.jpg?5817",
        "price": 218272,
        "name": "Hikers 43 Inches Frameless Android Smart FHD LED TV - Black-One Year Warranty",
        "description": "Hikers 43 Inches Frameless Android Smart FHD LED TV - Black-One Year Warranty"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/84/5518204/2.jpg?0431",
        "price": 595000,
        "name": "TCL 55 Inches UHD 4k Google Smart TV (55P635) + 1 Year Warranty",
        "description": "TCL 55 Inches UHD 4k Google Smart TV (55P635) + 1 Year Warranty"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/75/531868/1.jpg?7961",
        "price": 39000,
        "name": "Resizable Extendable Floor TV Stand",
        "description": "Resizable Extendable Floor TV Stand"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/39/626054/1.jpg?0926",
        "price": 35500,
        "name": "7.5ft. By 7.5ft. High Quality Brown Plain Curtain",
        "description": "7.5ft. By 7.5ft. High Quality Brown Plain Curtain"
    },
    {
        "category": "Living Room",
        "url": "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/39/626054/1.jpg?0926",
        "price": 35500,
        "name": "Vintage Luxury Style Rug Living Room Carpet Center Floor Mat",
        "description": "Vintage Luxury Style Rug Living Room Carpet Center Floor Mat"
    }
]
def upload_image_to_supabase(image_url, product_name):
    try:
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            ext = os.path.splitext(urlparse(image_url).path)[-1]
            file_name = f"{product_name.replace(' ', '_')}{ext}"
            # Upload to Supabase Storage
            supabase.storage.from_(BUCKET_NAME).upload(file_name, response.content, {"content-type": response.headers['Content-Type']})
            # Get public URL
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_name)
            return public_url
    except Exception as e:
        print(f"Failed to upload image: {e}")
    return ""

for product in product_details:
    supabase_image_url = upload_image_to_supabase(product["url"], product["name"])
    suggested_amount = product["price"]  # Or set your own logic

    cur.execute(
        """
        INSERT INTO products (name, category, description, price, image_url, suggested_amount)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            product["name"],
            product["category"],
            product["description"],
            product["price"],
            supabase_image_url,
            suggested_amount
        )
    )
    conn.commit()
    print(f"Inserted: {product['name']}")
cur.close()
conn.close()
print("Done! All products inserted into Neon DB with Supabase image URLs.")