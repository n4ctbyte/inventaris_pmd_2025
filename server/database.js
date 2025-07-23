const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'data.json');

// Initialize JSON database
const initDatabase = () => {
  const defaultData = {
    users: [
      {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        name: 'Administrator Sistem',
        role: 'admin',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        username: 'mahasiswa1',
        password: bcrypt.hashSync('user123', 10),
        name: 'Ahmad Budi Santoso',
        role: 'user',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        username: 'mahasiswa2',
        password: bcrypt.hashSync('user123', 10),
        name: 'Sari Dewi Lestari',
        role: 'user',
        created_at: new Date().toISOString()
      }
    ],
    items: [
      {
        id: 1,
        name: 'Proyektor Epson EB-X41',
        description: 'Proyektor berkualitas tinggi untuk presentasi dan kegiatan seminar dengan resolusi XGA 1024x768',
        stock: 2,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Kamera DSLR Canon EOS 1300D',
        description: 'Kamera digital untuk dokumentasi kegiatan organisasi dengan lensa kit 18-55mm',
        stock: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Speaker Bluetooth JBL Charge 4',
        description: 'Speaker portable dengan kualitas suara jernih untuk acara outdoor dan indoor',
        stock: 3,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Microphone Wireless Shure SM58',
        description: 'Microphone profesional untuk MC, pembicara, dan kegiatan panggung',
        stock: 4,
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Laptop Acer Aspire 5',
        description: 'Laptop untuk keperluan administrasi dan presentasi dengan spesifikasi Intel Core i5',
        stock: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Tripod Kamera Manfrotto',
        description: 'Tripod profesional untuk kamera dan smartphone, tinggi maksimal 165cm',
        stock: 2,
        created_at: new Date().toISOString()
      }
    ],
    borrowings: [
      {
        id: 1,
        user_id: 2,
        item_id: 3,
        quantity: 1,
        purpose: 'Kegiatan seminar Dharma dan Kehidupan Modern',
        borrow_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        return_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        condition_note: 'Kondisi baik, tidak ada kerusakan',
        status: 'returned'
      },
      {
        id: 2,
        user_id: 3,
        item_id: 1,
        quantity: 1,
        purpose: 'Presentasi tugas akhir mata kuliah Filsafat Buddha',
        borrow_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        return_date: null,
        condition_note: null,
        status: 'borrowed'
      }
    ],
    nextId: {
      users: 4,
      items: 7,
      borrowings: 3
    }
  };

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }

  return Promise.resolve();
};

// Helper functions to read and write data
const readData = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return null;
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// Database operations
const db = {
  // Users
  getUserByUsername: (username) => {
    const data = readData();
    return data ? data.users.find(user => user.username === username) : null;
  },

  getAllUsers: () => {
    const data = readData();
    return data ? data.users : [];
  },

  addUser: (userData) => {
    const data = readData();
    if (!data) return false;

    const newUser = {
      id: data.nextId.users++,
      ...userData,
      created_at: new Date().toISOString()
    };

    data.users.push(newUser);
    return writeData(data) ? newUser : null;
  },

  deleteUser: (id) => {
    const data = readData();
    if (!data) return false;

    data.users = data.users.filter(user => user.id !== id);
    return writeData(data);
  },

  // Items
  getAllItems: () => {
    const data = readData();
    return data ? data.items : [];
  },

  getItemById: (id) => {
    const data = readData();
    return data ? data.items.find(item => item.id === id) : null;
  },

  addItem: (itemData) => {
    const data = readData();
    if (!data) return false;

    const newItem = {
      id: data.nextId.items++,
      ...itemData,
      created_at: new Date().toISOString()
    };

    data.items.push(newItem);
    return writeData(data) ? newItem : null;
  },

  updateItem: (id, itemData) => {
    const data = readData();
    if (!data) return false;

    const itemIndex = data.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return false;

    data.items[itemIndex] = { ...data.items[itemIndex], ...itemData };
    return writeData(data);
  },

  deleteItem: (id) => {
    const data = readData();
    if (!data) return false;

    data.items = data.items.filter(item => item.id !== id);
    return writeData(data);
  },

  updateItemStock: (id, stockChange) => {
    const data = readData();
    if (!data) return false;

    const itemIndex = data.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return false;

    data.items[itemIndex].stock += stockChange;
    return writeData(data);
  },

  // Borrowings
  getAllBorrowings: () => {
    const data = readData();
    return data ? data.borrowings : [];
  },

  getBorrowingsByUserId: (userId) => {
    const data = readData();
    return data ? data.borrowings.filter(borrowing => borrowing.user_id === userId) : [];
  },

  getBorrowingById: (id) => {
    const data = readData();
    return data ? data.borrowings.find(borrowing => borrowing.id === id) : null;
  },

  addBorrowing: (borrowingData) => {
    const data = readData();
    if (!data) return false;

    const newBorrowing = {
      id: data.nextId.borrowings++,
      ...borrowingData,
      borrow_date: new Date().toISOString(),
      return_date: null,
      condition_note: null,
      status: 'borrowed'
    };

    data.borrowings.push(newBorrowing);
    return writeData(data) ? newBorrowing : null;
  },

  updateBorrowing: (id, borrowingData) => {
    const data = readData();
    if (!data) return false;

    const borrowingIndex = data.borrowings.findIndex(borrowing => borrowing.id === id);
    if (borrowingIndex === -1) return false;

    data.borrowings[borrowingIndex] = { ...data.borrowings[borrowingIndex], ...borrowingData };
    return writeData(data);
  }
};

module.exports = { db, initDatabase };