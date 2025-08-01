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
      name: 'Proyektor',
      description: 'Proyektor',
      stock: 2,
      created_at: new Date().toISOString()
    },
  ];

  const defaultBorrowings: Borrowing[] = [
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

export const deleteBorrowing = (id: number): boolean => {
  const borrowings = getBorrowings();
  const filteredBorrowings = borrowings.filter(borrowing => borrowing.id !== id);
  
  if (filteredBorrowings.length === borrowings.length) return false;
  
  saveBorrowings(filteredBorrowings);
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