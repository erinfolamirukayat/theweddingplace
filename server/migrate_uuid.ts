import { pool } from './src/index';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
    try {
        console.log('Adding uuid column to registries...');
        await pool.query(`
            ALTER TABLE registries 
            ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid() UNIQUE;
        `);
        console.log('Migration successful!');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
