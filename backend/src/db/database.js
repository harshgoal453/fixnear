const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../fixnear.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      phone TEXT,
      role TEXT CHECK(role IN ('customer', 'provider', 'admin')) NOT NULL DEFAULT 'customer',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL,
      description TEXT,
      base_price REAL NOT NULL DEFAULT 49.00,
      popular BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS technicians (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      business_name TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      bio TEXT,
      experience_years INTEGER DEFAULT 1,
      hourly_rate REAL NOT NULL,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      verified INTEGER CHECK(verified IN (0, 1, 2)) DEFAULT 0, -- 0: pending, 1: approved, 2: rejected
      verification_doc TEXT,
      address TEXT,
      city TEXT NOT NULL,
      skills TEXT, -- JSON string array
      availability_status TEXT CHECK(availability_status IN ('available', 'busy', 'offline')) DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      technician_id INTEGER NOT NULL,
      service_category_id INTEGER NOT NULL,
      booking_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      address TEXT NOT NULL,
      notes TEXT,
      status TEXT CHECK(status IN ('requested', 'accepted', 'in_progress', 'completed', 'cancelled')) DEFAULT 'requested',
      total_price REAL NOT NULL,
      payment_status TEXT CHECK(payment_status IN ('pending', 'paid')) DEFAULT 'pending',
      payment_id TEXT,
      payment_method TEXT DEFAULT 'UPI',
      completion_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE CASCADE,
      FOREIGN KEY (service_category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER UNIQUE NOT NULL,
      customer_id INTEGER NOT NULL,
      technician_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5) NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT CHECK(status IN ('open', 'under_investigation', 'resolved', 'dismissed')) DEFAULT 'open',
      resolution_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Safe runtime migrations for existing databases
  try {
    const userColumns = db.prepare("PRAGMA table_info(users)").all();
    if (!userColumns.some(c => c.name === 'password')) {
      db.exec("ALTER TABLE users ADD COLUMN password TEXT");
    }

    const bookingColumns = db.prepare("PRAGMA table_info(bookings)").all();
    if (!bookingColumns.some(c => c.name === 'payment_id')) {
      db.exec("ALTER TABLE bookings ADD COLUMN payment_id TEXT");
    }
    if (!bookingColumns.some(c => c.name === 'payment_method')) {
      db.exec("ALTER TABLE bookings ADD COLUMN payment_method TEXT DEFAULT 'UPI'");
    }
  } catch (err) {
    console.error('Migration warning:', err.message);
  }

  console.log('Database initialized successfully.');
}

initDb();

module.exports = db;
