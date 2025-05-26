import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' }); // Adjust path if your .env is elsewhere

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const products = [
  {
    name: 'Blender',
    category: 'Kitchen',
    description: 'A powerful kitchen blender.',
    price: 25000,
    image_url: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    suggested_amount: 5000,
  },
  {
    name: 'Dinner Set',
    category: 'Dining',
    description: 'Elegant 16-piece dinner set.',
    price: 18000,
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    suggested_amount: 3000,
  },
  {
    name: 'Bed Sheets',
    category: 'Bedroom',
    description: 'Soft cotton king-size bed sheets.',
    price: 12000,
    image_url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    suggested_amount: 2000,
  },
  {
    name: 'Microwave Oven',
    category: 'Kitchen',
    description: '700W microwave oven.',
    price: 40000,
    image_url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    suggested_amount: 8000,
  },
];

async function seedProducts() {
  try {
    for (const product of products) {
      await pool.query(
        `INSERT INTO products (name, category, description, price, image_url, suggested_amount)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          product.name,
          product.category,
          product.description,
          product.price,
          product.image_url,
          product.suggested_amount,
        ]
      );
    }
    console.log('Products seeded successfully!');
  } catch (err) {
    console.error('Error seeding products:', err);
  } finally {
    await pool.end();
  }
}

seedProducts(); 