import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get all transactions for a user
app.get('/api/transactions', async (req, res) => {
  try {
    console.log(req.headers['user-id']);
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const transactionsCol = collection(db, 'transactions');
    const transactionsQuery = query(
      transactionsCol,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(transactionsQuery);
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get a single transaction
app.get('/api/transactions/:id', async (req, res) => {
  
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const docRef = doc(db, 'transactions', req.params.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = docSnap.data();
    if (transaction.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.status(200).json({ id: docSnap.id, ...transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const { type, amount, description, category, date } = req.body;
    
    const newTransaction = {
      type,
      amount: Number(amount),
      description,
      category,
      date,
      userId,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'transactions'), newTransaction);
    res.status(201).json({ id: docRef.id, ...newTransaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update a transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const docRef = doc(db, 'transactions', req.params.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = docSnap.data();
    if (transaction.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { type, amount, description, category, date } = req.body;
    
    const updatedData = {
      type,
      amount: Number(amount),
      description,
      category,
      date,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updatedData);
    res.status(200).json({ id: req.params.id, ...updatedData, userId });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const docRef = doc(db, 'transactions', req.params.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = docSnap.data();
    if (transaction.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await deleteDoc(docRef);
    res.status(200).json({ id: req.params.id, message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});