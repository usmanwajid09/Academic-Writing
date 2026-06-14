import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'academic.db');

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT CHECK(role IN ('client', 'writer', 'admin')) NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders Table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        writer_id INTEGER,
        academic_level TEXT NOT NULL,
        paper_type TEXT NOT NULL,
        discipline TEXT NOT NULL,
        topic TEXT NOT NULL,
        instructions TEXT,
        format TEXT NOT NULL,
        deadline_date TEXT NOT NULL,
        page_qty INTEGER NOT NULL,
        spacing TEXT NOT NULL,
        sources_qty INTEGER NOT NULL,
        charts_qty INTEGER NOT NULL,
        slides_qty INTEGER NOT NULL,
        writer_category TEXT NOT NULL,
        addons TEXT, -- JSON string containing copy_source, progressive_delivery, etc.
        status TEXT CHECK(status IN ('pending', 'assigned', 'in_progress', 'review', 'completed', 'cancelled')) DEFAULT 'pending',
        total_price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(client_id) REFERENCES users(id),
        FOREIGN KEY(writer_id) REFERENCES users(id)
      )
    `);

    // Order Files Table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        uploaded_by INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT CHECK(file_type IN ('instruction', 'draft', 'final')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(uploaded_by) REFERENCES users(id)
      )
    `);

    // Messages Table (For direct chat between Client, Writer, Admin for an order)
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        message_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(sender_id) REFERENCES users(id)
      )
    `);

    // Create default Admin and Writer accounts for ease of verification if they don't exist
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('password123', salt);

    db.get("SELECT * FROM users WHERE email = 'admin@academic.com'", (err, row) => {
      if (!row) {
        db.run(
          "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
          ['admin@academic.com', defaultPasswordHash, 'System Admin', 'admin']
        );
      }
    });

    db.get("SELECT * FROM users WHERE email = 'writer@academic.com'", (err, row) => {
      if (!row) {
        db.run(
          "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
          ['writer@academic.com', defaultPasswordHash, 'John Writer', 'writer']
        );
      }
    });
  });
}

export default db;
