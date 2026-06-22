import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db from './db.js';

// Load environment variables
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'academic_writing_secret_key_default_fallback_12345';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Rate limiter for authentication endpoints (DDoS and brute-force protection)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: 'Too many authentication attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware to authenticate JWT
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// --- AUTH ROUTERS ---

// Register Client
router.post('/auth/register', authRateLimiter, (req, res) => {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  db.run(
    `INSERT INTO users (email, password_hash, name, role, phone) VALUES (?, ?, ?, 'client', ?)`,
    [email, passwordHash, name, phone || ''],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      const token = jwt.sign({ id: this.lastID, email, role: 'client', name }, JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ token, user: { id: this.lastID, email, name, role: 'client' } });
    }
  );
});

// Login
router.post('/auth/login', authRateLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone } });
  });
});

// Get current user profile
router.get('/auth/me', authenticateToken, (req, res) => {
  db.get(`SELECT id, email, name, role, phone, created_at FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(user);
  });
});


// --- ORDER ROUTERS ---

// Create Order (Client Only)
router.post('/orders', authenticateToken, (req, res) => {
  const {
    academic_level,
    paper_type,
    discipline,
    topic,
    instructions,
    format,
    deadline_date,
    page_qty,
    spacing,
    sources_qty,
    charts_qty,
    slides_qty,
    writer_category,
    addons,
    total_price
  } = req.body;

  if (!academic_level || !paper_type || !discipline || !format || !deadline_date || !page_qty || !spacing) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client_id = req.user.id;
  const addonsStr = addons ? JSON.stringify(addons) : '{}';

  db.run(
    `INSERT INTO orders (
      client_id, academic_level, paper_type, discipline, topic, instructions, format,
      deadline_date, page_qty, spacing, sources_qty, charts_qty, slides_qty,
      writer_category, addons, status, total_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [
      client_id, academic_level, paper_type, discipline, topic || "Writer's Choice", instructions || '', format,
      deadline_date, page_qty, spacing, sources_qty || 0, charts_qty || 0, slides_qty || 0,
      writer_category, addonsStr, total_price
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Order placed successfully' });
    }
  );
});

// Get User Orders (Dashboard lists)
router.get('/orders', authenticateToken, (req, res) => {
  const { id, role } = req.user;

  let query = '';
  let params = [];

  if (role === 'admin') {
    query = `
      SELECT o.*, c.name as client_name, w.name as writer_name 
      FROM orders o
      JOIN users c ON o.client_id = c.id
      LEFT JOIN users w ON o.writer_id = w.id
      ORDER BY o.created_at DESC
    `;
  } else if (role === 'writer') {
    query = `
      SELECT o.*, c.name as client_name 
      FROM orders o
      JOIN users c ON o.client_id = c.id
      WHERE o.writer_id = ? OR o.status = 'pending'
      ORDER BY o.created_at DESC
    `;
    params = [id];
  } else {
    // client
    query = `
      SELECT o.*, w.name as writer_name 
      FROM orders o
      LEFT JOIN users w ON o.writer_id = w.id
      WHERE o.client_id = ?
      ORDER BY o.created_at DESC
    `;
    params = [id];
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => {
      if (row.addons) {
        try {
          row.addons = JSON.parse(row.addons);
        } catch (e) {
          row.addons = {};
        }
      }
      return row;
    }));
  });
});

// Get single order details
router.get('/orders/:id', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  const { id, role } = req.user;

  db.get(
    `SELECT o.*, c.name as client_name, c.email as client_email, w.name as writer_name 
     FROM orders o
     JOIN users c ON o.client_id = c.id
     LEFT JOIN users w ON o.writer_id = w.id
     WHERE o.id = ?`,
    [orderId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Order not found' });

      // Access control
      if (role === 'client' && row.client_id !== id) {
        return res.status(403).json({ error: 'Unauthorized to view this order' });
      }
      if (role === 'writer' && row.writer_id !== id && row.status !== 'pending') {
        return res.status(403).json({ error: 'Unauthorized to view this order' });
      }

      if (row.addons) {
        try {
          row.addons = JSON.parse(row.addons);
        } catch (e) {
          row.addons = {};
        }
      }
      res.json(row);
    }
  );
});

// Update Order Status
router.put('/orders/:id/status', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const { id, role } = req.user;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  // Get order to check permissions
  db.get(`SELECT client_id, writer_id FROM orders WHERE id = ?`, [orderId], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Writer can only update status of assigned orders
    if (role === 'writer' && order.writer_id !== id) {
      return res.status(403).json({ error: 'Unauthorized to update status for this order' });
    }
    // Client cannot update status
    if (role === 'client') {
      return res.status(403).json({ error: 'Clients cannot modify order status directly' });
    }

    db.run(`UPDATE orders SET status = ? WHERE id = ?`, [status, orderId], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Order status updated successfully' });
    });
  });
});

// Claim / Assign Order
router.put('/orders/:id/assign', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  const { writer_id } = req.body; // Nullable if writer is claiming it themselves
  const { id, role } = req.user;

  const targetWriterId = role === 'writer' ? id : writer_id;

  if (!targetWriterId) {
    return res.status(400).json({ error: 'Writer ID is required' });
  }

  // Admin can assign, Writer can claim if status is pending and no writer assigned
  db.get(`SELECT writer_id, status FROM orders WHERE id = ?`, [orderId], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (role === 'writer' && (order.writer_id !== null || order.status !== 'pending')) {
      return res.status(400).json({ error: 'Order is no longer available to claim' });
    }

    const nextStatus = 'assigned';

    db.run(
      `UPDATE orders SET writer_id = ?, status = ? WHERE id = ?`,
      [targetWriterId, nextStatus, orderId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order assigned successfully', writer_id: targetWriterId });
      }
    );
  });
});


// --- FILES ROUTERS ---

// Upload file for an order
router.post('/orders/:id/files', authenticateToken, upload.single('file'), (req, res) => {
  const orderId = req.params.id;
  const { file_type } = req.body; // 'instruction', 'draft', 'final'
  const file = req.file;

  if (!file || !file_type) {
    return res.status(400).json({ error: 'File and file_type required' });
  }

  // Access validation: Check if user belongs to order
  db.get(`SELECT client_id, writer_id FROM orders WHERE id = ?`, [orderId], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const { id, role } = req.user;
    if (role === 'client' && order.client_id !== id) {
      return res.status(403).json({ error: 'Unauthorized file upload' });
    }
    if (role === 'writer' && order.writer_id !== id) {
      return res.status(403).json({ error: 'Unauthorized file upload' });
    }

    db.run(
      `INSERT INTO order_files (order_id, uploaded_by, file_path, file_name, file_type) VALUES (?, ?, ?, ?, ?)`,
      [orderId, id, file.path, file.originalname, file_type],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, file_name: file.originalname, file_type });
      }
    );
  });
});

// Get files for an order
router.get('/orders/:id/files', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  const { id, role } = req.user;

  db.get(`SELECT client_id, writer_id FROM orders WHERE id = ?`, [orderId], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (role === 'client' && order.client_id !== id) {
      return res.status(403).json({ error: 'Unauthorized to access files' });
    }
    if (role === 'writer' && order.writer_id !== id && order.status !== 'pending') {
      return res.status(403).json({ error: 'Unauthorized to access files' });
    }

    db.all(
      `SELECT f.id, f.file_name, f.file_type, f.created_at, u.name as uploader_name, u.role as uploader_role
       FROM order_files f
       JOIN users u ON f.uploaded_by = u.id
       WHERE f.order_id = ?
       ORDER BY f.created_at DESC`,
      [orderId],
      (err, files) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(files);
      }
    );
  });
});

// Download a file
router.get('/files/download/:fileId', authenticateToken, (req, res) => {
  const fileId = req.params.fileId;

  db.get(
    `SELECT f.*, o.client_id, o.writer_id 
     FROM order_files f
     JOIN orders o ON f.order_id = o.id
     WHERE f.id = ?`,
    [fileId],
    (err, file) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!file) return res.status(404).json({ error: 'File not found' });

      // Validate access
      const { id, role } = req.user;
      if (role === 'client' && file.client_id !== id) {
        return res.status(403).json({ error: 'Unauthorized file download' });
      }
      if (role === 'writer' && file.writer_id !== id) {
        return res.status(403).json({ error: 'Unauthorized file download' });
      }

      if (!fs.existsSync(file.file_path)) {
        return res.status(404).json({ error: 'File missing on server' });
      }

      res.download(file.file_path, file.file_name);
    }
  );
});


// --- MESSAGES ROUTERS ---

// Send a message
router.post('/orders/:id/messages', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  const { message_text } = req.body;
  const { id } = req.user;

  if (!message_text) return res.status(400).json({ error: 'Message text is required' });

  // Access validation
  db.get(`SELECT client_id, writer_id FROM orders WHERE id = ?`, [orderId], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const { role } = req.user;
    if (role === 'client' && order.client_id !== id) {
      return res.status(403).json({ error: 'Unauthorized message posting' });
    }
    if (role === 'writer' && order.writer_id !== id) {
      return res.status(403).json({ error: 'Unauthorized message posting' });
    }

    db.run(
      `INSERT INTO messages (order_id, sender_id, message_text) VALUES (?, ?, ?)`,
      [orderId, id, message_text],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, sender_id: id, message_text, created_at: new Date() });
      }
    );
  });
});

// Get messages for an order
router.get('/orders/:id/messages', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  const { id, role } = req.user;

  db.get(`SELECT client_id, writer_id FROM orders WHERE id = ?`, [orderId], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (role === 'client' && order.client_id !== id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (role === 'writer' && order.writer_id !== id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    db.all(
      `SELECT m.id, m.sender_id, m.message_text, m.created_at, u.name as sender_name, u.role as sender_role
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.order_id = ?
       ORDER BY m.created_at ASC`,
      [orderId],
      (err, messages) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(messages);
      }
    );
  });
});

export default router;
