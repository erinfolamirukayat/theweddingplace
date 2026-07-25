import { Pool } from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const CLOUD_NAME = 'dex3v19sz';
const UPLOAD_PRESET = 'gift_item_preset';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const productDetails = [
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/47/7680883/1.jpg?8793",
    price: 58900,
    name: "Solid Stoneware Dinner Plate Set 16pcs",
    description: "Solid Stoneware Dinner Plate Set 16pcs"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/50/9558804/1.jpg?6135",
    price: 58900,
    name: "Solid Stoneware Dinner Plate Set 16pcs (Variant)",
    description: "Solid Stoneware Dinner Plate Set 16pcs"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/89/608593/1.jpg?9059",
    price: 49500,
    name: "16 Pieces Dinner Set",
    description: "16 Pieces Dinner Set"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/44/9917963/1.jpg?7924",
    price: 11000,
    name: "Tequila Shot Glasses, 12 Pieces",
    description: "Tequila Shot Glasses, 12 Pieces"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/84/9107893/3.jpg?7497",
    price: 27280,
    name: "SILVER CREST 2L Industrial 8500W Food Crusher Blender With 2 Jar",
    description: "SILVER CREST 2L Industrial 8500W Food Crusher Blender With 2 Jar"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/37/4538504/1.jpg?3187",
    price: 58356,
    name: "TINMO Airfryer 10L Volume, 8L Storage Capacity, Model (OLM-KZB006) 1400W+ 12 Months Warranty",
    description: "TINMO Airfryer 10L Volume, 8L Storage Capacity, Model (OLM-KZB006) 1400W+ 12 Months Warranty"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/45/8722904/1.jpg?9421",
    price: 35305,
    name: "Binatone 1.5 Litres Blender With Grinder 300W (BLG-410) - White + 2 Years Warranty",
    description: "Binatone 1.5 Litres Blender With Grinder 300W (BLG-410) - White + 2 Years Warranty"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/19/2293473/1.jpg?2207",
    price: 72626,
    name: "Glamstar 20 Litres Analog Microwave (GMW-20LMX7-B(B)) - Black",
    description: "Glamstar 20 Litres Analog Microwave (GMW-20LMX7-B(B)) - Black"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/07/3190262/1.jpg?2427",
    price: 96555,
    name: "Haier Thermocool 20 Litres Manual Microwave (MM20BB01) -Black + 1 Year Warranty",
    description: "Haier Thermocool 20 Litres Manual Microwave (MM20BB01) -Black + 1 Year Warranty"
  },
  {
    category: "Kitchen & Dining",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/43/3529804/1.jpg?4510",
    price: 44776,
    name: "SILVER CREST 6L Extra Large Capacity Digital AirFryer",
    description: "SILVER CREST 6L Extra Large Capacity Digital AirFryer"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/26/2019153/1.jpg?3805",
    price: 42000,
    name: "Black White Center Table-Coffee Table Home Furniture",
    description: "Black White Center Table-Coffee Table Home Furniture"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/47/939736/1.jpg?8513",
    price: 53000,
    name: "3 In 1 Center Table Plus Two Detachable Side Tables",
    description: "3 In 1 Center Table Plus Two Detachable Side Tables"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/05/5121522/1.jpg?1659",
    price: 260000,
    name: "Dining Room Table With 4 Leather Chairs",
    description: "Dining Room Table With 4 Leather Chairs"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/44/2636301/1.jpg?4094",
    price: 136000,
    name: "Nexus 32 Inches FHD TV (H620B(SA) - Black + 2 Years Warranty",
    description: "Nexus 32 Inches FHD TV (H620B(SA) - Black + 2 Years Warranty"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/67/4471583/4.jpg?5817",
    price: 218272,
    name: "Hikers 43 Inches Frameless Android Smart FHD LED TV - Black-One Year Warranty",
    description: "Hikers 43 Inches Frameless Android Smart FHD LED TV - Black-One Year Warranty"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/84/5518204/2.jpg?0431",
    price: 595000,
    name: "TCL 55 Inches UHD 4k Google Smart TV (55P635) + 1 Year Warranty",
    description: "TCL 55 Inches UHD 4k Google Smart TV (55P635) + 1 Year Warranty"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/75/531868/1.jpg?7961",
    price: 39000,
    name: "Resizable Extendable Floor TV Stand",
    description: "Resizable Extendable Floor TV Stand"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/39/626054/1.jpg?0926",
    price: 35500,
    name: "7.5ft. By 7.5ft. High Quality Brown Plain Curtain",
    description: "7.5ft. By 7.5ft. High Quality Brown Plain Curtain"
  },
  {
    category: "Living Room",
    url: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/39/626054/1.jpg?0926",
    price: 35500,
    name: "Vintage Luxury Style Rug Living Room Carpet Center Floor Mat",
    description: "Vintage Luxury Style Rug Living Room Carpet Carpet Center Floor Mat"
  }
];

async function uploadToCloudinary(imageUrl: string): Promise<string> {
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        file: imageUrl,
        upload_preset: UPLOAD_PRESET
      }
    );
    return response.data.secure_url;
  } catch (error: any) {
    console.error(`Failed to upload to Cloudinary for URL: ${imageUrl}`, error.response?.data || error.message);
    throw error;
  }
}

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Connected to Neon DB. Clearing existing products...");
    await client.query("TRUNCATE TABLE products CASCADE;");

    for (const product of productDetails) {
      console.log(`Uploading: ${product.name} ...`);
      let cloudinaryUrl = "";
      try {
        cloudinaryUrl = await uploadToCloudinary(product.url);
        console.log(`Uploaded to Cloudinary: ${cloudinaryUrl}`);
      } catch (err) {
        console.log(`Fallback to original URL due to upload error`);
        cloudinaryUrl = product.url;
      }

      await client.query(
        `INSERT INTO products (name, category, description, price, image_url, suggested_amount)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          product.name,
          product.category,
          product.description,
          product.price,
          cloudinaryUrl,
          product.price
        ]
      );
      console.log(`Saved product in Neon: ${product.name}`);
    }

    console.log("Catalog images migration completed successfully!");
  } catch (error) {
    console.error("Migration script error:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
