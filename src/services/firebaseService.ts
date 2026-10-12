import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { AppSettings, Category, Order, OrderStatus, Product } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from '../data/initialData';

export const FirebaseService = {
  // Check if UID is in `admins` collection
  async isUserAdmin(uid: string): Promise<boolean> {
    if (!db) return false;
    try {
      const adminDocRef = doc(db, 'admins', uid);
      const snapshot = await getDoc(adminDocRef);
      return snapshot.exists();
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `admins/${uid}`);
      return false;
    }
  },

  // PRODUCTS
  subscribeProducts(
    isAdmin: boolean,
    callback: (products: Product[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    if (!db) return () => {};

    const productsRef = collection(db, 'products');
    // Non-admins only receive active products per security rules
    const q = isAdmin ? productsRef : query(productsRef, where('isActive', '==', true));

    return onSnapshot(
      q,
      (snapshot) => {
        const productsList: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          productsList.push({
            id: docSnap.id,
            name: data.name || '',
            categoryId: data.categoryId || 'autres',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            stock: Number(data.stock ?? 0),
            lowStockThreshold: Number(data.lowStockThreshold ?? 5),
            detailPrice: Number(data.detailPrice ?? 0),
            wholesaleEnabled: Boolean(data.wholesaleEnabled),
            minimumWholesaleQuantity: Number(data.minimumWholesaleQuantity ?? 3),
            wholesaleTiers: Array.isArray(data.wholesaleTiers) ? data.wholesaleTiers : [],
            allowRetail: Boolean(data.allowRetail ?? true),
            isActive: Boolean(data.isActive ?? true),
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          });
        });
        callback(productsList);
      },
      (error) => {
        console.error('Products snapshot error:', error);
        onError?.(error);
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );
  },

  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const productRef = doc(db, 'products', newId);

    const payload = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(productRef, payload);
      return newId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${newId}`);
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const productRef = doc(db, 'products', id);

    try {
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  },

  async deleteProduct(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const productRef = doc(db, 'products', id);

    try {
      await deleteDoc(productRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  },

  async updateStock(id: string, newStock: number): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const productRef = doc(db, 'products', id);

    try {
      await updateDoc(productRef, {
        stock: Math.max(0, newStock),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  },

  // CATEGORIES
  subscribeCategories(
    callback: (categories: Category[]) => void
  ): () => void {
    if (!db) return () => {};

    const categoriesRef = collection(db, 'categories');
    return onSnapshot(
      categoriesRef,
      (snapshot) => {
        if (snapshot.empty) {
          callback(INITIAL_CATEGORIES);
          return;
        }
        const cats: Category[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cats.push({
            id: docSnap.id as any,
            name: data.name || docSnap.id,
            description: data.description || '',
          });
        });
        callback(cats);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'categories');
      }
    );
  },

  // SETTINGS
  subscribeSettings(
    callback: (settings: AppSettings) => void
  ): () => void {
    if (!db) return () => {};

    const settingsRef = doc(db, 'settings', 'general');
    return onSnapshot(
      settingsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          callback(INITIAL_SETTINGS);
          return;
        }
        callback(snapshot.data() as AppSettings);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/general');
      }
    );
  },

  async updateSettings(settings: AppSettings): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const settingsRef = doc(db, 'settings', 'general');

    try {
      await setDoc(settingsRef, settings, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/general');
    }
  },

  // ORDERS
  subscribeOrders(
    callback: (orders: Order[]) => void
  ): () => void {
    if (!db) return () => {};

    const ordersRef = collection(db, 'orders');
    return onSnapshot(
      ordersRef,
      (snapshot) => {
        const ordersList: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          ordersList.push({
            id: docSnap.id,
            orderNumber: data.orderNumber || docSnap.id,
            customerName: data.customerName || '',
            phone: data.phone || '',
            city: data.city || '',
            area: data.area || '',
            deliveryNote: data.deliveryNote || '',
            notes: data.notes || '',
            items: data.items || [],
            total: Number(data.total || 0),
            status: data.status || 'Nouvelle',
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          });
        });
        // Sort newest first
        ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(ordersList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );
  },

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    if (!db) throw new Error('Firestore not initialized');
    const newId = `ord-${Date.now()}`;
    const orderRef = doc(db, 'orders', newId);

    const fullOrder: Order = {
      ...orderData,
      id: newId,
    };

    try {
      await setDoc(orderRef, fullOrder);
      return fullOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${newId}`);
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const orderRef = doc(db, 'orders', orderId);

    try {
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  },

  // Database Seed Helper (can be executed by Admin if Firestore is completely empty)
  async seedInitialFirestoreData(): Promise<void> {
    if (!db) return;
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (snap.empty) {
        for (const p of INITIAL_PRODUCTS) {
          await setDoc(doc(db, 'products', p.id), p);
        }
      }

      const setSnap = await getDoc(doc(db, 'settings', 'general'));
      if (!setSnap.exists()) {
        await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
      }

      const catSnap = await getDocs(collection(db, 'categories'));
      if (catSnap.empty) {
        for (const c of INITIAL_CATEGORIES) {
          await setDoc(doc(db, 'categories', c.id), c);
        }
      }
    } catch (error) {
      console.warn('Initial seeding note:', error);
    }
  },
};
