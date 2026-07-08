-- Database Schema for The Impetus MVP (Supabase)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  sizes TEXT[], -- Array of size strings
  colors TEXT[], -- Array of color hex codes
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  category VARCHAR(100) DEFAULT 'new-arrivals', -- new-arrivals, hottest, featured, sale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_reference VARCHAR(255),
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  size VARCHAR(10),
  color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'Nigeria',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Insert initial products
INSERT INTO products (name, description, price, image_url, alt_text, sizes, colors, rating, in_stock, stock_quantity) VALUES
('Air Jordan 11 Space Jam', 'Iconic high-top silhouette', 320000.00, '/air-jordan-11.webp', 'Air Jordan 11', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['#000000', '#FFFFFF', '#0000FF'], 5, true, 50),
('Adidas Samba OG Heritage', 'Timeless soccer-inspired', 120000.00, '/adidas-samba.webp', 'Adidas Samba', ARRAY['6', '7', '8', '9', '10', '11'], ARRAY['#000000', '#FFFFFF'], 4, true, 100),
('Air Force 1 ''07 Neon', 'Fresh colorway alert', 110000.00, '/air-force-1.webp', 'Nike Air Force 1', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['#00FF00', '#000000'], 4, true, 80),
('Air Jordan 11 Retro Low Bred', 'Classic red and black', 280000.00, '/air-jordan-11.webp', 'Air Jordan 11 Retro Low Bred', ARRAY['8', '9', '10', '11', '12'], ARRAY['#000000', '#FF0000'], 5, true, 60),
('Adidas Adizero EVO SL', 'Performance racing shoe', 200000.00, '/adizero-evo-sl.jpg', 'Adidas Adizero', ARRAY['7', '8', '9', '10', '11'], ARRAY['#FFFFFF', '#000000'], 4, true, 40),
('Air Jordan 3 Brazil', 'Vibrant retro colorway', 240000.00, '/air-jordan-3.webp', 'Air Jordan 3 Brazil', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['#00FF00', '#FFFF00', '#000000'], 5, false, 0),
('New Balance 574 Classic', 'Heritage running silhouette', 95000.00, '/new-balance-574-transparent.png', 'New Balance 574', ARRAY['6', '7', '8', '9', '10', '11', '12'], ARRAY['#808080', '#000000', '#FFFFFF'], 4, true, 120),
('Nike Dunk Low Retro', 'Vintage basketball style', 135000.00, '/nike-dunk-low-transparent.png', 'Nike Dunk Low', ARRAY['7', '8', '9', '10', '11'], ARRAY['#FFFFFF', '#FF69B4', '#90EE90'], 4, true, 90),
('Jordan Low OG', 'Simplified court classic', 180000.00, '/jordan-low.png', 'Jordan Low', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['#000000', '#FFFFFF', '#FF0000'], 4, true, 70),
('Adillette Comfy Slides', 'Casual comfort footwear', 45000.00, '/adillette-comfy-slides-transparent.png', 'Adillette Slides', ARRAY['6', '7', '8', '9', '10', '11', '12'], ARRAY['#000000', '#FFFFFF', '#FF0000'], 3, true, 150),
('Adillette Premium Slides', 'Luxury comfort experience', 65000.00, '/adillette-comfy-slides.jpg', 'Adillette Premium', ARRAY['7', '8', '9', '10', '11'], ARRAY['#000000', '#FFFFFF', '#0000FF'], 4, true, 100),
('Nike Air Max 90', 'Visible air cushioning', 145000.00, '/nike-air-max-90.webp', 'Nike Air Max 90', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['#FFFFFF', '#000000', '#FF0000'], 5, true, 85)
ON CONFLICT DO NOTHING;
