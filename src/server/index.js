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
  Timestamp 
} from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/transactions', async (req, res) => {
  try {
    const transactionsCol = collection(db, 'transactions');
    const transactionsQuery = query(transactionsCol, orderBy('date', 'desc'));
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

app.get('/api/transactions/:id', async (req, res) => {
  try {
    const docRef = doc(db, 'transactions', req.params.id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      res.status(200).json({ id: docSnap.id, ...docSnap.data() });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    
    const newTransaction = {
      type,
      amount: Number(amount),
      description,
      category,
      date,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'transactions'), newTransaction);
    res.status(201).json({ id: docRef.id, ...newTransaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    const docRef = doc(db, 'transactions', req.params.id);
    
    const updatedData = {
      type,
      amount: Number(amount),
      description,
      category,
      date,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updatedData);
    res.status(200).json({ id: req.params.id, ...updatedData });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const docRef = doc(db, 'transactions', req.params.id);
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