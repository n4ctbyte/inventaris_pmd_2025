// Utility functions for localStorage management

export interface Item {
  id: number;
  name: string;
  description: string;
  stock: number;
  created_at: string;
}

export interface Borrowing {
  id: number;
  item_id: number;
  item_name: string;
  quantity: number;
  purpose: string;
  borrower_name: string;
  borrow_date: string;
  return_date?: string;
  condition_note?: string;
  status: 'borrowed' | 'returned';
}

// Initialize default data
const initializeData = () => {
  const defaultItems: Item[] = [
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
  ];

  const defaultBorrowings: Borrowing[] = [
    {
      id: 1,
      item_id: 3,
      item_name: 'Speaker Bluetooth JBL Charge 4',
      quantity: 1,
      purpose: 'Kegiatan seminar Dharma dan Kehidupan Modern',
      borrower_name: 'Ahmad Budi Santoso',
      borrow_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      return_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      condition_note: 'Kondisi baik, tidak ada kerusakan',
      status: 'returned'
    },
    {
      id: 2,
      item_id: 1,
      item_name: 'Proyektor Epson EB-X41',
      quantity: 1,
      purpose: 'Presentasi tugas akhir mata kuliah Filsafat Buddha',
      borrower_name: 'Sari Dewi Lestari',
      borrow_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'borrowed'
    }
  ];

  if (!localStorage.getItem('inventaris_items')) {
    localStorage.setItem('inventaris_items', JSON.stringify(defaultItems));
  }
  
  if (!localStorage.getItem('inventaris_borrowings')) {
    localStorage.setItem('inventaris_borrowings', JSON.stringify(defaultBorrowings));
  }

  if (!localStorage.getItem('inventaris_next_id')) {
    localStorage.setItem('inventaris_next_id', JSON.stringify({ items: 7, borrowings: 3 }));
  }
};

// Items management
export const getItems = (): Item[] => {
  initializeData();
  const items = localStorage.getItem('inventaris_items');
  return items ? JSON.parse(items) : [];
};

export const saveItems = (items: Item[]): void => {
  localStorage.setItem('inventaris_items', JSON.stringify(items));
};

export const addItem = (itemData: Omit<Item, 'id' | 'created_at'>): Item => {
  const items = getItems();
  const nextId = getNextId();
  
  const newItem: Item = {
    id: nextId.items,
    ...itemData,
    created_at: new Date().toISOString()
  };

  items.push(newItem);
  saveItems(items);
  
  updateNextId({ ...nextId, items: nextId.items + 1 });
  
  return newItem;
};

export const updateItem = (id: number, itemData: Partial<Item>): boolean => {
  const items = getItems();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  items[index] = { ...items[index], ...itemData };
  saveItems(items);
  
  return true;
};

export const deleteItem = (id: number): boolean => {
  const items = getItems();
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  saveItems(filteredItems);
  return true;
};

// Borrowings management
export const getBorrowings = (): Borrowing[] => {
  initializeData();
  const borrowings = localStorage.getItem('inventaris_borrowings');
  return borrowings ? JSON.parse(borrowings) : [];
};

export const saveBorrowings = (borrowings: Borrowing[]): void => {
  localStorage.setItem('inventaris_borrowings', JSON.stringify(borrowings));
};

export const addBorrowing = (borrowingData: Omit<Borrowing, 'id' | 'borrow_date' | 'status'>): Borrowing => {
  const borrowings = getBorrowings();
  const nextId = getNextId();
  
  const newBorrowing: Borrowing = {
    id: nextId.borrowings,
    ...borrowingData,
    borrow_date: new Date().toISOString(),
    status: 'borrowed'
  };

  borrowings.push(newBorrowing);
  saveBorrowings(borrowings);
  
  updateNextId({ ...nextId, borrowings: nextId.borrowings + 1 });
  
  return newBorrowing;
};

export const updateBorrowing = (id: number, borrowingData: Partial<Borrowing>): boolean => {
  const borrowings = getBorrowings();
  const index = borrowings.findIndex(borrowing => borrowing.id === id);
  
  if (index === -1) return false;
  
  borrowings[index] = { ...borrowings[index], ...borrowingData };
  saveBorrowings(borrowings);
  
  return true;
};

// Next ID management
const getNextId = () => {
  const nextId = localStorage.getItem('inventaris_next_id');
  return nextId ? JSON.parse(nextId) : { items: 1, borrowings: 1 };
};

const updateNextId = (nextId: { items: number; borrowings: number }) => {
  localStorage.setItem('inventaris_next_id', JSON.stringify(nextId));
};