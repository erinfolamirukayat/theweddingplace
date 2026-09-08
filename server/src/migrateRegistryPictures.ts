import { Pool } from 'pg';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = process.env.DATABASE_URL
      ? {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        }
      : { database: process.env.DB_NAME };
const pool = new Pool(dbConfig);

const CLOUD_NAME = "dex3v19sz";
const UPLOAD_PRESET = "user_photo_preset";

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
    console.log("Connected to DB. Searching for Supabase images...");

    const picturesRes = await client.query(`SELECT id, image_url FROM registry_pictures WHERE image_url LIKE '%supabase.co%'`);
    console.log(`Found ${picturesRes.rows.length} pictures to migrate.`);

    for (const pic of picturesRes.rows) {
      console.log(`Migrating picture ID ${pic.id}: ${pic.image_url}`);
      try {
        const cloudinaryUrl = await uploadToCloudinary(pic.image_url);
        await client.query(`UPDATE registry_pictures SET image_url = $1 WHERE id = $2`, [cloudinaryUrl, pic.id]);
        console.log(`Successfully migrated picture ID ${pic.id} to Cloudinary: ${cloudinaryUrl}`);
      } catch (err) {
        console.error(`Skipping picture ID ${pic.id} due to upload error`);
      }
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
