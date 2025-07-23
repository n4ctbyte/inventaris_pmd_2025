const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating users table:', err);
      });

      // Items table
      db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        stock INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating items table:', err);
      });

      // Borrowings table
      db.run(`CREATE TABLE IF NOT EXISTS borrowings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        purpose TEXT NOT NULL,
        borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        return_date DATETIME,
        condition_note TEXT,
        status TEXT DEFAULT 'borrowed' CHECK(status IN ('borrowed', 'returned')),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (item_id) REFERENCES items (id)
      )`, (err) => {
        if (err) console.error('Error creating borrowings table:', err);
      });

      // Create default admin user
      const adminPassword = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT OR IGNORE INTO users (username, password, name, role) 
              VALUES ('admin', ?, 'Administrator', 'admin')`, [adminPassword], (err) => {
        if (err) console.error('Error creating admin user:', err);
      });

      // Insert sample data
      db.run(`INSERT OR IGNORE INTO items (name, description, stock) VALUES 
              ('Proyektor', 'Proyektor untuk presentasi dan kegiatan', 2),
              ('Kamera DSLR', 'Kamera untuk dokumentasi kegiatan', 1),
              ('Speaker Bluetooth', 'Speaker portable untuk acara', 3),
              ('Microphone Wireless', 'Microphone untuk MC dan pembicara', 4),
              ('Laptop Acer', 'Laptop untuk keperluan administrasi', 1)`, (err) => {
        if (err) console.error('Error inserting sample items:', err);
      });

      // Create sample user
      const userPassword = bcrypt.hashSync('user123', 10);
      db.run(`INSERT OR IGNORE INTO users (username, password, name, role) 
              VALUES ('mahasiswa1', ?, 'Ahmad Budi', 'user')`, [userPassword], (err) => {
        if (err) console.error('Error creating sample user:', err);
        resolve();
      });
    });
  });
};

module.exports = { db, initDatabase };