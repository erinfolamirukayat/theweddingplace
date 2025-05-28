-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    suggested_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registries table
CREATE TABLE registries (
    id SERIAL PRIMARY KEY,
    couple_names VARCHAR(255) NOT NULL,
    wedding_date DATE NOT NULL,
    story TEXT,
    share_url VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    wedding_city VARCHAR(255),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(30)
);

-- Create registry_items table
CREATE TABLE registry_items (
    id SERIAL PRIMARY KEY,
    registry_id INTEGER REFERENCES registries(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    contributions_received DECIMAL(10,2) DEFAULT 0,
    is_fully_funded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contributors table
CREATE TABLE contributors (
    id SERIAL PRIMARY KEY,
    registry_item_id INTEGER REFERENCES registry_items(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    payment_reference VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registry_pictures table
CREATE TABLE registry_pictures (
    id SERIAL PRIMARY KEY,
    registry_id INTEGER REFERENCES registries(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    how_heard VARCHAR(255),
); 