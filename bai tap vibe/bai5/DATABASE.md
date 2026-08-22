# DATABASE SPECIFICATION - SQLite Schema & Seed Data

## 1. Cấu trúc Bảng SQLite (Schema)

```sql
-- 1. Bảng Users (Người dùng & Quản trị)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    avatar TEXT,
    role VARCHAR(10) DEFAULT 'user', -- 'admin' hoặc 'user'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Airlines (Hãng hàng không)
CREATE TABLE IF NOT EXISTS airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    country VARCHAR(50)
);

-- 3. Bảng Flights (Chuyến bay)
CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_code VARCHAR(20) NOT NULL,
    airline_id INTEGER,
    departure_city VARCHAR(100) NOT NULL,
    arrival_city VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration_minutes INTEGER,
    flight_type VARCHAR(20) DEFAULT 'direct', -- 'direct' (bay thẳng), 'transit'
    aircraft_type VARCHAR(50), -- 'Boeing 787', 'Airbus A350', 'Airbus A321'
    price_economy DECIMAL(12,2) NOT NULL,
    price_business DECIMAL(12,2) NOT NULL,
    seats_economy INTEGER DEFAULT 150,
    seats_business INTEGER DEFAULT 30,
    services TEXT, -- 'Hành lý 20kg, Suất ăn nóng, Wifi, Giải trí'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 4. Bảng Tours (Tour du lịch)
CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    departure_city VARCHAR(100) NOT NULL,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    thumbnail_url TEXT, -- Kích thước chuẩn 600x400
    airline_id INTEGER,
    aircraft_type VARCHAR(50),
    departure_date DATE NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    travel_agency VARCHAR(100) NOT NULL,
    services TEXT,
    itinerary TEXT, -- Lịch trình JSON hoặc Text chi tiết từng ngày
    rating DECIMAL(2,1) DEFAULT 5.0,
    featured INTEGER DEFAULT 0, -- 1 là tour nổi bật trang chủ
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 5. Bảng Bookings (Đơn đặt chỗ)
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT,
    booking_type VARCHAR(20) NOT NULL, -- 'flight', 'tour', 'both'
    item_details TEXT NOT NULL, -- JSON chi tiết vé / tour đã chọn
    total_amount DECIMAL(12,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'completed',
    sender_email VARCHAR(100) DEFAULT 'nvhai061993@gmail.com',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Seed Data Mẫu

```sql
-- Seed Users
INSERT INTO users (username, email, password, full_name, phone, role) VALUES 
('admin', 'admin@travel.com', 'Admin123!', 'Quản Trị Viên', '0901234567', 'admin'),
('user', 'user@travel.com', 'User123!', 'Nguyễn Văn Khách', '0912345678', 'user');

-- Seed Airlines
INSERT INTO airlines (code, name, logo_url, country) VALUES
('VN', 'Vietnam Airlines', 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=120&auto=format&fit=crop&q=60', 'Việt Nam'),
('VJ', 'VietJet Air', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=60', 'Việt Nam'),
('QH', 'Bamboo Airways', 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=120&auto=format&fit=crop&q=60', 'Việt Nam'),
('SQ', 'Singapore Airlines', 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=120&auto=format&fit=crop&q=60', 'Singapore'),
('EK', 'Emirates', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=120&auto=format&fit=crop&q=60', 'UAE'),
('QR', 'Qatar Airways', 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=120&auto=format&fit=crop&q=60', 'Qatar'),
('TG', 'Thai Airways', 'https://images.unsplash.com/photo-1570710891163-6d3b5c47245b?w=120&auto=format&fit=crop&q=60', 'Thái Lan'),
('JL', 'Japan Airlines', 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=120&auto=format&fit=crop&q=60', 'Nhật Bản');
```
