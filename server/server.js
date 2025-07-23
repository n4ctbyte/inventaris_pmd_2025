const express = require('express');
const cors = require('cors');
const { db, initDatabase } = require('./database');

const app = express();
const PORT = 3001;

// Simple JWT alternative - just use base64 encoding for demo
const createToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

const verifyToken = (token) => {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) {
      return null; // Token expired
    }
    return payload;
  } catch {
    return null;
  }
};

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

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ message: 'Token tidak valid atau expired' });
  }

  req.user = user;
  next();
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

  const user = db.getUserByUsername(username);

  if (!user || !db.verifyPassword(password, user.password)) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }

  const token = createToken(user);

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

// Get all items
app.get('/api/items', authenticateToken, (req, res) => {
  const items = db.getAllItems();
  res.json(items);
});

// Add item (admin only)
app.post('/api/items', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, stock } = req.body;

  const newItem = db.addItem({ name, description, stock });
  if (newItem) {
    res.json({ id: newItem.id, message: 'Barang berhasil ditambahkan' });
  } else {
    res.status(500).json({ message: 'Kesalahan menambah barang' });
  }
});

// Update item (admin only)
app.put('/api/items/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, stock } = req.body;
  const id = parseInt(req.params.id);

  const success = db.updateItem(id, { name, description, stock });
  if (success) {
    res.json({ message: 'Barang berhasil diubah' });
  } else {
    res.status(500).json({ message: 'Kesalahan mengubah barang' });
  }
});

// Delete item (admin only)
app.delete('/api/items/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  const success = db.deleteItem(id);
  if (success) {
    res.json({ message: 'Barang berhasil dihapus' });
  } else {
    res.status(500).json({ message: 'Kesalahan menghapus barang' });
  }
});

// Borrow item
app.post('/api/borrow', authenticateToken, (req, res) => {
  const { item_id, quantity, purpose } = req.body;
  const user_id = req.user.id;

  const item = db.getItemById(item_id);
  if (!item) {
    return res.status(404).json({ message: 'Barang tidak ditemukan' });
  }

  if (item.stock < quantity) {
    return res.status(400).json({ message: 'Stok tidak mencukupi' });
  }

  const newBorrowing = db.addBorrowing({ user_id, item_id, quantity, purpose });
  if (newBorrowing) {
    const stockUpdated = db.updateItemStock(item_id, -quantity);
    if (stockUpdated) {
      res.json({ message: 'Peminjaman berhasil dicatat' });
    } else {
      res.status(500).json({ message: 'Kesalahan mengupdate stok' });
    }
  } else {
    res.status(500).json({ message: 'Kesalahan mencatat peminjaman' });
  }
});

// Return item
app.post('/api/return', authenticateToken, (req, res) => {
  const { borrowing_id, condition_note } = req.body;

  const borrowing = db.getBorrowingById(borrowing_id);
  if (!borrowing || borrowing.user_id !== req.user.id || borrowing.status !== 'borrowed') {
    return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
  }

  const updateSuccess = db.updateBorrowing(borrowing_id, {
    return_date: new Date().toISOString(),
    condition_note,
    status: 'returned'
  });

  if (updateSuccess) {
    const stockUpdated = db.updateItemStock(borrowing.item_id, borrowing.quantity);
    if (stockUpdated) {
      res.json({ message: 'Pengembalian berhasil dicatat' });
    } else {
      res.status(500).json({ message: 'Kesalahan mengupdate stok' });
    }
  } else {
    res.status(500).json({ message: 'Kesalahan mengupdate data pengembalian' });
  }
});

// Get user's borrowing history
app.get('/api/my-borrowings', authenticateToken, (req, res) => {
  const borrowings = db.getBorrowingsByUserId(req.user.id);
  const items = db.getAllItems();
  
  const enrichedBorrowings = borrowings.map(borrowing => {
    const item = items.find(i => i.id === borrowing.item_id);
    return {
      ...borrowing,
      item_name: item ? item.name : 'Unknown',
      item_description: item ? item.description : 'Unknown'
    };
  }).sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));

  res.json(enrichedBorrowings);
});

// Get all borrowings (admin only)
app.get('/api/all-borrowings', authenticateToken, requireAdmin, (req, res) => {
  const borrowings = db.getAllBorrowings();
  const items = db.getAllItems();
  const users = db.getAllUsers();
  
  const enrichedBorrowings = borrowings.map(borrowing => {
    const item = items.find(i => i.id === borrowing.item_id);
    const user = users.find(u => u.id === borrowing.user_id);
    return {
      ...borrowing,
      item_name: item ? item.name : 'Unknown',
      user_name: user ? user.name : 'Unknown'
    };
  }).sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));

  res.json(enrichedBorrowings);
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const users = db.getAllUsers().map(user => ({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    created_at: user.created_at
  }));
  res.json(users);
});

// Add user (admin only)
app.post('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const { username, password, name, role } = req.body;

  // Check if username already exists
  const existingUser = db.getUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username sudah digunakan' });
  }

  const newUser = db.addUser({ username, password, name, role });

  if (newUser) {
    res.json({ id: newUser.id, message: 'Pengguna berhasil ditambahkan' });
  } else {
    res.status(500).json({ message: 'Kesalahan menambah pengguna' });
  }
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  if (id === req.user.id) {
    return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });
  }

  const success = db.deleteUser(id);
  if (success) {
    res.json({ message: 'Pengguna berhasil dihapus' });
  } else {
    res.status(500).json({ message: 'Kesalahan menghapus pengguna' });
  }
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
    console.log('📋 Akun Demo:');
    console.log('   👨‍💼 Admin: username=admin, password=admin123');
    console.log('   👨‍🎓 User 1: username=mahasiswa1, password=user123');
    console.log('   👩‍🎓 User 2: username=mahasiswa2, password=user123');
    console.log('💾 Database: JSON file (server/data.json)');
  });
}).catch(err => {
  console.error('❌ Kesalahan inisialisasi database:', err);
});