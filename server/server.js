const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initDatabase } = require('./database');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token akses diperlukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
  }
  next();
};

// Routes

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Kesalahan server' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  });
});

// Get all items
app.get('/api/items', authenticateToken, (req, res) => {
  db.all('SELECT * FROM items ORDER BY name', (err, items) => {
    if (err) {
      return res.status(500).json({ message: 'Kesalahan mengambil data barang' });
    }
    res.json(items);
  });
});

// Add item (admin only)
app.post('/api/items', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, stock } = req.body;

  db.run('INSERT INTO items (name, description, stock) VALUES (?, ?, ?)',
    [name, description, stock], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Kesalahan menambah barang' });
      }
      res.json({ id: this.lastID, message: 'Barang berhasil ditambahkan' });
    });
});

// Update item (admin only)
app.put('/api/items/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, stock } = req.body;
  const { id } = req.params;

  db.run('UPDATE items SET name = ?, description = ?, stock = ? WHERE id = ?',
    [name, description, stock, id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Kesalahan mengubah barang' });
      }
      res.json({ message: 'Barang berhasil diubah' });
    });
});

// Delete item (admin only)
app.delete('/api/items/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM items WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Kesalahan menghapus barang' });
    }
    res.json({ message: 'Barang berhasil dihapus' });
  });
});

// Borrow item
app.post('/api/borrow', authenticateToken, (req, res) => {
  const { item_id, quantity, purpose } = req.body;
  const user_id = req.user.id;

  // Check if item has enough stock
  db.get('SELECT * FROM items WHERE id = ?', [item_id], (err, item) => {
    if (err) {
      return res.status(500).json({ message: 'Kesalahan mengambil data barang' });
    }

    if (!item) {
      return res.status(404).json({ message: 'Barang tidak ditemukan' });
    }

    if (item.stock < quantity) {
      return res.status(400).json({ message: 'Stok tidak mencukupi' });
    }

    // Start transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Insert borrowing record
      db.run('INSERT INTO borrowings (user_id, item_id, quantity, purpose) VALUES (?, ?, ?, ?)',
        [user_id, item_id, quantity, purpose], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ message: 'Kesalahan mencatat peminjaman' });
          }

          // Update item stock
          db.run('UPDATE items SET stock = stock - ? WHERE id = ?',
            [quantity, item_id], function(err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ message: 'Kesalahan mengupdate stok' });
              }

              db.run('COMMIT');
              res.json({ message: 'Peminjaman berhasil dicatat' });
            });
        });
    });
  });
});

// Return item
app.post('/api/return', authenticateToken, (req, res) => {
  const { borrowing_id, condition_note } = req.body;

  // Get borrowing record
  db.get('SELECT * FROM borrowings WHERE id = ? AND user_id = ? AND status = "borrowed"',
    [borrowing_id, req.user.id], (err, borrowing) => {
      if (err) {
        return res.status(500).json({ message: 'Kesalahan mengambil data peminjaman' });
      }

      if (!borrowing) {
        return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
      }

      // Start transaction
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Update borrowing record
        db.run('UPDATE borrowings SET return_date = CURRENT_TIMESTAMP, condition_note = ?, status = "returned" WHERE id = ?',
          [condition_note, borrowing_id], function(err) {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ message: 'Kesalahan mengupdate data pengembalian' });
            }

            // Update item stock
            db.run('UPDATE items SET stock = stock + ? WHERE id = ?',
              [borrowing.quantity, borrowing.item_id], function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ message: 'Kesalahan mengupdate stok' });
                }

                db.run('COMMIT');
                res.json({ message: 'Pengembalian berhasil dicatat' });
              });
          });
      });
    });
});

// Get user's borrowing history
app.get('/api/my-borrowings', authenticateToken, (req, res) => {
  const query = `
    SELECT b.*, i.name as item_name, i.description as item_description
    FROM borrowings b
    JOIN items i ON b.item_id = i.id
    WHERE b.user_id = ?
    ORDER BY b.borrow_date DESC
  `;

  db.all(query, [req.user.id], (err, borrowings) => {
    if (err) {
      return res.status(500).json({ message: 'Kesalahan mengambil riwayat peminjaman' });
    }
    res.json(borrowings);
  });
});

// Get all borrowings (admin only)
app.get('/api/all-borrowings', authenticateToken, requireAdmin, (req, res) => {
  const query = `
    SELECT b.*, i.name as item_name, u.name as user_name
    FROM borrowings b
    JOIN items i ON b.item_id = i.id
    JOIN users u ON b.user_id = u.id
    ORDER BY b.borrow_date DESC
  `;

  db.all(query, (err, borrowings) => {
    if (err) {
      return res.status(500).json({ message: 'Kesalahan mengambil riwayat peminjaman' });
    }
    res.json(borrowings);
  });
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT id, username, name, role, created_at FROM users ORDER BY name', (err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Kesalahan mengambil data pengguna' });
    }
    res.json(users);
  });
});

// Add user (admin only)
app.post('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const { username, password, name, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, name, role], function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ message: 'Username sudah digunakan' });
        }
        return res.status(500).json({ message: 'Kesalahan menambah pengguna' });
      }
      res.json({ id: this.lastID, message: 'Pengguna berhasil ditambahkan' });
    });
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  // Prevent deleting admin
  if (id == req.user.id) {
    return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Kesalahan menghapus pengguna' });
    }
    res.json({ message: 'Pengguna berhasil dihapus' });
  });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log('Login admin: username=admin, password=admin123');
    console.log('Login user: username=mahasiswa1, password=user123');
  });
}).catch(err => {
  console.error('Kesalahan inisialisasi database:', err);
});