/* ==========================================================================
   TravelViet - SQLite Database Engine & Data Seed Bridge (sql.js + LocalStorage)
   ========================================================================== */

const DB_STORAGE_KEY = 'travelviet_sqlite_db_v2';
let db = null;
let dbReadyPromise = null;

// Initialize SQL.js and Database
function initDatabase() {
  if (dbReadyPromise) return dbReadyPromise;

  dbReadyPromise = new Promise((resolve, reject) => {
    if (typeof initSqlJs === 'undefined') {
      console.warn('sql.js script not loaded yet. Retrying...');
      setTimeout(() => initDatabase().then(resolve).catch(reject), 500);
      return;
    }

    initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    }).then(SQL => {
      try {
        const savedDb = localStorage.getItem(DB_STORAGE_KEY);
        if (savedDb) {
          const uInt8Array = new Uint8Array(JSON.parse(savedDb));
          db = new SQL.Database(uInt8Array);
          console.log('SQLite Database loaded from LocalStorage.');
        } else {
          db = new SQL.Database();
          console.log('Initializing fresh SQLite Database & Seeding Data...');
          createTables();
          seedInitialData();
          saveDatabase();
        }
        resolve(db);
      } catch (err) {
        console.error('Failed to load database from LocalStorage, creating new one.', err);
        db = new SQL.Database();
        createTables();
        seedInitialData();
        saveDatabase();
        resolve(db);
      }
    }).catch(err => {
      console.error('Error initializing sql.js:', err);
      reject(err);
    });
  });

  return dbReadyPromise;
}

// Save Database to LocalStorage
function saveDatabase() {
  if (!db) return;
  try {
    const data = db.export();
    const array = Array.from(data);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(array));
  } catch (err) {
    console.error('Error saving SQLite DB to LocalStorage:', err);
  }
}

// Create Database Schema
function createTables() {
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(15) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(100),
      phone VARCHAR(20),
      address VARCHAR(100),
      avatar TEXT,
      role VARCHAR(10) DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS airlines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code VARCHAR(10) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      logo_url TEXT,
      country VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flight_code VARCHAR(20) NOT NULL,
      airline_id INTEGER,
      departure_city VARCHAR(100) NOT NULL,
      arrival_city VARCHAR(100) NOT NULL,
      departure_time DATETIME NOT NULL,
      arrival_time DATETIME NOT NULL,
      duration_minutes INTEGER,
      flight_type VARCHAR(20) DEFAULT 'direct',
      aircraft_type VARCHAR(50),
      price_economy DECIMAL(12,2) NOT NULL,
      price_business DECIMAL(12,2) NOT NULL,
      seats_economy INTEGER DEFAULT 150,
      seats_business INTEGER DEFAULT 30,
      services TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (airline_id) REFERENCES airlines(id)
    );

    CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tour_code VARCHAR(20) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      country VARCHAR(100) NOT NULL,
      destination_city VARCHAR(100) NOT NULL,
      departure_city VARCHAR(100) NOT NULL,
      duration_days INTEGER NOT NULL,
      duration_nights INTEGER NOT NULL,
      thumbnail_url TEXT,
      airline_id INTEGER,
      aircraft_type VARCHAR(50),
      departure_date DATE NOT NULL,
      price DECIMAL(12,2) NOT NULL,
      travel_agency VARCHAR(100) NOT NULL,
      services TEXT,
      itinerary TEXT,
      rating DECIMAL(2,1) DEFAULT 5.0,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (airline_id) REFERENCES airlines(id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_code VARCHAR(20) UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name VARCHAR(100) NOT NULL,
      customer_email VARCHAR(100) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      customer_address TEXT,
      booking_type VARCHAR(20) NOT NULL,
      item_details TEXT NOT NULL,
      total_amount DECIMAL(12,2) NOT NULL,
      payment_status VARCHAR(20) DEFAULT 'completed',
      sender_email VARCHAR(100) DEFAULT 'nvhai061993@gmail.com',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.run(schemaSql);
}

// Populate Rich Seed Data
function seedInitialData() {
  // 1. Seed Users
  db.run(`
    INSERT INTO users (username, email, password, full_name, phone, avatar, role) VALUES 
    ('admin', 'admin@travel.com', 'Admin123!', 'TravelViet Administrator', '0901234567', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'admin'),
    ('user', 'user@travel.com', 'User123!', 'Nguyễn Văn User', '0912345678', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'user');
  `);

  // 2. Seed Airlines (10 Airlines)
  const airlines = [
    ['VN', 'Vietnam Airlines', 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=120&auto=format&fit=crop&q=60', 'Việt Nam'],
    ['VJ', 'VietJet Air', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=60', 'Việt Nam'],
    ['QH', 'Bamboo Airways', 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=120&auto=format&fit=crop&q=60', 'Việt Nam'],
    ['BL', 'Pacific Airlines', 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=120&auto=format&fit=crop&q=60', 'Việt Nam'],
    ['SQ', 'Singapore Airlines', 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=120&auto=format&fit=crop&q=60', 'Singapore'],
    ['TG', 'Thai Airways', 'https://images.unsplash.com/photo-1570710891163-6d3b5c47245b?w=120&auto=format&fit=crop&q=60', 'Thái Lan'],
    ['AK', 'AirAsia', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&auto=format&fit=crop&q=60', 'Malaysia'],
    ['KE', 'Korean Air', 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=120&auto=format&fit=crop&q=60', 'Hàn Quốc'],
    ['JL', 'Japan Airlines', 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=120&auto=format&fit=crop&q=60', 'Nhật Bản'],
    ['EK', 'Emirates', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=120&auto=format&fit=crop&q=60', 'UAE']
  ];

  const airlineStmt = db.prepare(`INSERT INTO airlines (code, name, logo_url, country) VALUES (?, ?, ?, ?)`);
  airlines.forEach(a => airlineStmt.run(a));
  airlineStmt.free();

  // 3. Seed 100+ Flights
  const cities = ['TP.HCM (SGN)', 'Hà Nội (HAN)', 'Đà Nẵng (DAD)', 'Phú Quốc (PQC)', 'Nha Trang (CXR)', 'Singapore (SIN)', 'Bangkok (BKK)', 'Seoul (ICN)', 'Tokyo (NRT)', 'Dubai (DXB)'];
  const aircrafts = ['Boeing 787 Dreamliner', 'Airbus A350-900', 'Airbus A321neo', 'Boeing 777-300ER', 'Airbus A330'];
  const flightStmt = db.prepare(`
    INSERT INTO flights (flight_code, airline_id, departure_city, arrival_city, departure_time, arrival_time, duration_minutes, flight_type, aircraft_type, price_economy, price_business, services)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let flightCount = 0;
  for (let i = 1; i <= 105; i++) {
    const airlineId = Math.floor(Math.random() * 10) + 1;
    const airlineCode = airlines[airlineId - 1][0];
    const code = `${airlineCode}${100 + i}`;
    
    let depCity = cities[i % cities.length];
    let arrCity = cities[(i + 3) % cities.length];
    if (depCity === arrCity) arrCity = cities[(i + 1) % cities.length];

    const depDate = new Date();
    depDate.setDate(depDate.getDate() + (i % 30) + 1);
    depDate.setHours(6 + (i % 14), (i * 15) % 60, 0);

    const duration = 75 + (i % 8) * 45;
    const arrDate = new Date(depDate.getTime() + duration * 60000);

    const flightType = i % 5 === 0 ? 'transit' : 'direct';
    const aircraft = aircrafts[i % aircrafts.length];
    const priceEco = 1200000 + (i * 85000) % 9000000;
    const priceBus = priceEco * 2.5;
    const services = 'Hành lý ký gửi 20kg, Suất ăn nóng, Wifi miễn phí, Màn hình giải trí';

    flightStmt.run([
      code, airlineId, depCity, arrCity,
      depDate.toISOString().replace('T', ' ').substring(0, 16),
      arrDate.toISOString().replace('T', ' ').substring(0, 16),
      duration, flightType, aircraft, priceEco, priceBus, services
    ]);
    flightCount++;
  }
  flightStmt.free();

  // 4. Seed Featured 8 Tours & 100+ Total Tours
  const featuredToursData = [
    {
      code: 'TOUR001',
      title: 'Hà Nội - Vịnh Hạ Long 4 Ngày 3 Đêm',
      country: 'Việt Nam',
      dest: 'Hạ Long',
      dep: 'TP.HCM',
      days: 4, nights: 3,
      img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80',
      airlineId: 1, aircraft: 'Boeing 787',
      price: 6890000, agency: 'TravelViet',
      rating: 4.9, featured: 1
    },
    {
      code: 'TOUR002',
      title: 'Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ',
      country: 'Việt Nam',
      dest: 'Đà Nẵng',
      dep: 'Hà Nội',
      days: 4, nights: 3,
      img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&auto=format&fit=crop&q=80',
      airlineId: 3, aircraft: 'Airbus A321neo',
      price: 5490000, agency: 'Vietravel',
      rating: 4.8, featured: 1
    },
    {
      code: 'TOUR003',
      title: 'Phú Quốc Thiên Đường Biển Đảo 4N3Đ',
      country: 'Việt Nam',
      dest: 'Phú Quốc',
      dep: 'TP.HCM',
      days: 4, nights: 3,
      img: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=600&auto=format&fit=crop&q=80',
      airlineId: 2, aircraft: 'Airbus A320',
      price: 4990000, agency: 'Saigontourist',
      rating: 5.0, featured: 1
    },
    {
      code: 'TOUR004',
      title: 'Nha Trang - Biển Xanh Cát Trắng 4N3Đ',
      country: 'Việt Nam',
      dest: 'Nha Trang',
      dep: 'Hà Nội',
      days: 4, nights: 3,
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      airlineId: 1, aircraft: 'Airbus A350',
      price: 4590000, agency: 'TravelViet',
      rating: 4.7, featured: 1
    },
    {
      code: 'TOUR005',
      title: 'Đà Lạt Thành Phố Sương Mù 3N2Đ',
      country: 'Việt Nam',
      dest: 'Đà Lạt',
      dep: 'TP.HCM',
      days: 3, nights: 2,
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      airlineId: 3, aircraft: 'Airbus A321',
      price: 3290000, agency: 'Vietravel',
      rating: 4.8, featured: 1
    },
    {
      code: 'TOUR006',
      title: 'Tràng An - Bái Đính - Ninh Bình 3N2Đ',
      country: 'Việt Nam',
      dest: 'Ninh Bình',
      dep: 'TP.HCM',
      days: 3, nights: 2,
      img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80',
      airlineId: 1, aircraft: 'Boeing 787',
      price: 3890000, agency: 'Saigontourist',
      rating: 4.9, featured: 1
    },
    {
      code: 'TOUR007',
      title: 'Hành Trình Miền Tây Sông Nước 3N2Đ',
      country: 'Việt Nam',
      dest: 'Cần Thơ',
      dep: 'Hà Nội',
      days: 3, nights: 2,
      img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=80',
      airlineId: 2, aircraft: 'Airbus A320',
      price: 3490000, agency: 'TravelViet',
      rating: 4.6, featured: 1
    },
    {
      code: 'TOUR008',
      title: 'Sapa - Chinh Phục Đỉnh Fansipan 4N3Đ',
      country: 'Việt Nam',
      dest: 'Sapa',
      dep: 'TP.HCM',
      days: 4, nights: 3,
      img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80',
      airlineId: 1, aircraft: 'Airbus A350',
      price: 5990000, agency: 'Vietravel',
      rating: 4.9, featured: 1
    }
  ];

  const tourStmt = db.prepare(`
    INSERT INTO tours (tour_code, title, country, destination_city, departure_city, duration_days, duration_nights, thumbnail_url, airline_id, aircraft_type, departure_date, price, travel_agency, services, itinerary, rating, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Insert 8 Featured Tours
  featuredToursData.forEach(t => {
    const itinerary = JSON.stringify([
      { day: 1, title: 'Ngày 1: Khởi hành & Nhận phòng khách sạn', detail: 'Tập trung tại sân bay, làm thủ tục chuyến bay. Đến nơi HDV đưa về khách sạn nghỉ ngơi.' },
      { day: 2, title: 'Ngày 2: Khám phá danh lam thắng cảnh', detail: 'Tham quan các điểm du lịch nổi tiếng, thưởng thức ẩm thực đặc sản địa phương.' },
      { day: 3, title: 'Ngày 3: Trải nghiệm văn hóa & Mua sắm', detail: 'Tự do trải nghiệm, mua sắm quà lưu niệm tại các trung tâm thương mại.' },
      { day: 4, title: 'Ngày 4: Thăm danh thắng & Trở về', detail: 'Tham quan mua sắm đặc sản, xe đưa ra sân bay đáp chuyến bay trở về.' }
    ]);
    tourStmt.run([
      t.code, t.title, t.country, t.dest, t.dep, t.days, t.nights, t.img, t.airlineId, t.aircraft, '2026-09-10', t.price, t.agency, 'Khách sạn 4*, Vé máy bay khứ hồi, Bảo hiểm du lịch, Hướng dẫn viên', itinerary, t.rating, t.featured
    ]);
  });

  // Insert additional 95 Tours for testing pagination (total ~103 tours)
  const countriesList = ['Thái Lan', 'Singapore', 'Nhật Bản', 'Hàn Quốc', 'Châu Âu - Pháp', 'Châu Âu - Ý', 'Úc', 'UAE - Dubai', 'Malaysia', 'Trung Quốc'];
  const AgenciesList = ['TravelViet', 'Vietravel', 'Saigontourist', 'Fiditour'];
  const TourThumbnails = [
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80'
  ];

  for (let i = 9; i <= 103; i++) {
    const code = `TOUR${i < 100 ? '0' + i : i}`;
    const country = countriesList[i % countriesList.length];
    const title = `Khám Phá ${country} Tuyệt Đẹp (${i % 2 === 0 ? '5N4Đ' : '6N5Đ'})`;
    const dest = country.split(' - ')[1] || country;
    const dep = i % 2 === 0 ? 'TP.HCM' : 'Hà Nội';
    const days = i % 2 === 0 ? 5 : 6;
    const nights = days - 1;
    const img = TourThumbnails[i % TourThumbnails.length];
    const airlineId = (i % 10) + 1;
    const price = 8900000 + (i * 450000) % 25000000;
    const agency = AgenciesList[i % AgenciesList.length];

    const itinerary = JSON.stringify([
      { day: 1, title: 'Ngày 1: Bay đến điểm đến & Check-in', detail: 'Đoàn tập trung làm thủ tục, khởi hành chuyến bay quốc tế.' },
      { day: 2, title: 'Ngày 2: Tham quan thành phố & Di tích', detail: 'Điểm tham quan nổi tiếng, thưởng thức buffet tối.' },
      { day: 3, title: 'Ngày 3: Khám phá thiên nhiên & Trải nghiệm', detail: 'Trải nghiệm văn hóa địa phương, tự do mua sắm.' },
      { day: 4, title: 'Ngày 4: Mua sắm & Tự do', detail: 'Thư giãn tại khu nghỉ dưỡng, tự do mua sắm sầm uất.' },
      { day: 5, title: 'Ngày 5: Trở về Việt Nam', detail: 'Xe đưa ra sân bay về lại Việt Nam. Kết thúc chuyến đi tốt đẹp.' }
    ]);

    tourStmt.run([
      code, title, country, dest, dep, days, nights, img, airlineId, 'Airbus A350', '2026-09-15', price, agency, 'Vé máy bay khứ hồi, Khách sạn 4-5*, Ăn uống trọn gói, Xe đưa đón', itinerary, 4.8, 0
    ]);
  }
  tourStmt.free();

  // 5. Seed Bookings for Dashboard KPI & Charts Data
  const seedBookings = [
    ['BK1001', 2, 'Nguyễn Văn A', 'user@travel.com', '0912345678', 'TP.HCM', 'tour', JSON.stringify({ itemTitle: 'Hà Nội - Vịnh Hạ Long 4N3Đ', tourCode: 'TOUR001', country: 'Việt Nam' }), 6890000],
    ['BK1002', 2, 'Trần Thị B', 'user@travel.com', '0922334455', 'Hà Nội', 'flight', JSON.stringify({ flightCode: 'VN101', airlineName: 'Vietnam Airlines', route: 'TP.HCM -> Hà Nội' }), 2500000],
    ['BK1003', null, 'Lê Văn C', 'levanc@gmail.com', '0988776655', 'Đà Nẵng', 'tour', JSON.stringify({ itemTitle: 'Khám Phá Thái Lan Tuyệt Đẹp', country: 'Thái Lan' }), 9800000],
    ['BK1004', null, 'Phạm Thị D', 'phamd@gmail.com', '0977665544', 'Cần Thơ', 'flight', JSON.stringify({ flightCode: 'VJ102', airlineName: 'VietJet Air', route: 'Hà Nội -> Phú Quốc' }), 1800000],
    ['BK1005', null, 'Hoàng Văn E', 'hoange@gmail.com', '0966554433', 'Hải Phòng', 'tour', JSON.stringify({ itemTitle: 'Khám Phá Nhật Bản Tuyệt Đẹp', country: 'Nhật Bản' }), 24500000],
    ['BK1006', null, 'Vũ Thị F', 'vuf@gmail.com', '0955443322', 'Nha Trang', 'flight', JSON.stringify({ flightCode: 'SQ105', airlineName: 'Singapore Airlines', route: 'TP.HCM -> Singapore' }), 5400000],
    ['BK1007', null, 'Đặng Văn G', 'dangg@gmail.com', '0944332211', 'Huế', 'tour', JSON.stringify({ itemTitle: 'Khám Phá Hàn Quốc Tuyệt Đẹp', country: 'Hàn Quốc' }), 16800000],
    ['BK1008', null, 'Ngô Thị H', 'ngoh@gmail.com', '0933221100', 'Đà Lạt', 'flight', JSON.stringify({ flightCode: 'EK110', airlineName: 'Emirates', route: 'TP.HCM -> Dubai' }), 18900000]
  ];

  const bookingStmt = db.prepare(`
    INSERT INTO bookings (booking_code, user_id, customer_name, customer_email, customer_phone, customer_address, booking_type, item_details, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  seedBookings.forEach(b => bookingStmt.run(b));
  bookingStmt.free();
}

// Database Exec & Query Helper Functions
function dbQuery(sql, params = []) {
  if (!db) return [];
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (err) {
    console.error('dbQuery error:', err, 'SQL:', sql);
    return [];
  }
}

function dbExec(sql, params = []) {
  if (!db) return false;
  try {
    db.run(sql, params);
    saveDatabase();
    return true;
  } catch (err) {
    console.error('dbExec error:', err, 'SQL:', sql);
    return false;
  }
}

function dbInsert(table, data) {
  const keys = Object.keys(data);
  const placeholders = keys.map(() => '?').join(', ');
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  const values = Object.values(data);
  const success = dbExec(sql, values);
  return success;
}

function dbUpdate(table, id, data) {
  const keys = Object.keys(data);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  const values = [...Object.values(data), id];
  return dbExec(sql, values);
}

function dbDelete(table, id) {
  const sql = `DELETE FROM ${table} WHERE id = ?`;
  return dbExec(sql, [id]);
}

// Auto-run Database Initialization
document.addEventListener('DOMContentLoaded', () => {
  initDatabase().catch(err => console.error('Database failed to initialize:', err));
});
