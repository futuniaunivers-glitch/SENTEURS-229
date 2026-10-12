import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppSettings,
  CartItem,
  Category,
  CategoryId,
  Order,
  OrderStatus,
  Product,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { StorageService } from '../services/storage';
import { calculateUnitPrice, isQuantityCompliant } from '../utils/pricing';
import { isFirebaseConfigured, auth, adminEmail } from '../services/firebase';
import { FirebaseService } from '../services/firebaseService';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

export type AppView =
  | 'home'
  | 'products'
  | 'cart'
  | 'checkout'
  | 'conditions'
  | 'contact'
  | 'admin';

export type AdminTab = 'dashboard' | 'products' | 'orders' | 'settings';

interface AppContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  navigateToProduct: (productId: string) => void;

  // Firebase status
  isFirebaseActive: boolean;
  currentUser: User | null;

  // Categories & Search
  categories: Category[];
  activeCategory: CategoryId;
  setActiveCategory: (category: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  activeProducts: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, deltaOrValue: number, isAbsolute?: boolean) => Promise<void>;
  toggleProductActive: (id: string) => Promise<void>;
  resetDemoData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateCartQuantity: (productId: string, newQuantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    phone: string;
    city: string;
    area: string;
    deliveryNote: string;
    notes?: string;
    items: CartItem[];
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;

  // Admin Auth
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  changeAdminPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;

  // Conditions Modal
  isConditionsModalOpen: boolean;
  setIsConditionsModalOpen: (open: boolean) => void;

  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => {
    return isFirebaseConfigured ? [] : StorageService.getProducts();
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    return isFirebaseConfigured ? [] : StorageService.getOrders();
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    return isFirebaseConfigured ? INITIAL_SETTINGS : StorageService.getSettings();
  });

  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());

  // UI States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // 1. Firebase Auth listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const currentAuth = auth;

    const unsubscribe = onAuthStateChanged(currentAuth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Verify user UID exists in `admins` Firestore collection
        const hasAdminDoc = await FirebaseService.isUserAdmin(user.uid);
        if (hasAdminDoc) {
          setIsAdminAuthenticated(true);
        } else {
          setIsAdminAuthenticated(false);
          // If non-admin user is logged in, sign them out from admin access
          await signOut(currentAuth);
        }
      } else {
        setIsAdminAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore sync when Firebase is configured
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // Categories
    const unsubCats = FirebaseService.subscribeCategories((fetchedCats) => {
      setCategories(fetchedCats);
    });

    // Settings
    const unsubSettings = FirebaseService.subscribeSettings((fetchedSettings) => {
      setSettings(fetchedSettings);
    });

    // Products (respects rules: visitors get only active, admins get all)
    const unsubProducts = FirebaseService.subscribeProducts(
      isAdminAuthenticated,
      (fetchedProducts) => {
        setProducts(fetchedProducts);
      },
      (err) => {
        console.warn('Subscription notice:', err);
      }
    );

    // Orders (only if admin is authenticated)
    let unsubOrders = () => {};
    if (isAdminAuthenticated) {
      unsubOrders = FirebaseService.subscribeOrders((fetchedOrders) => {
        setOrders(fetchedOrders);
      });
    }

    return () => {
      unsubCats();
      unsubSettings();
      unsubProducts();
      unsubOrders();
    };
  }, [isAdminAuthenticated]);

  // Sync cart to localStorage
  useEffect(() => {
    StorageService.saveCart(cart);
  }, [cart]);

  // In Local Demo Mode only: persist products, orders, settings to localStorage
  useEffect(() => {
    if (!isFirebaseConfigured) {
      StorageService.saveProducts(products);
      StorageService.saveOrders(orders);
      StorageService.saveSettings(settings);
    }
  }, [products, orders, settings]);

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'admin') {
        setCurrentView('admin');
      } else if (hash === 'products') {
        setCurrentView('products');
      } else if (hash === 'cart') {
        setCurrentView('cart');
      } else if (hash === 'checkout') {
        setCurrentView('checkout');
      } else if (hash === 'conditions') {
        setCurrentView('conditions');
      } else if (hash === 'contact') {
        setCurrentView('contact');
      } else if (hash === '' || hash === 'home') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetCurrentView = (view: AppView) => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = `#/${view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  // Only active products are visible to public visitors
  const activeProducts = products.filter((p) => p.isActive);

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const addToCart = (
    product: Product,
    requestedQuantity: number = 1
  ): { success: boolean; message?: string } => {
    if (!product.isActive) {
      showToast('Ce produit est momentanément indisponible.', 'error');
      return { success: false, message: 'Produit inactif' };
    }

    if (product.stock <= 0) {
      showToast('Cet article est en rupture de stock.', 'error');
      return { success: false, message: 'Rupture de stock' };
    }

    let finalQty = requestedQuantity;
    if (!product.allowRetail && product.wholesaleEnabled && finalQty < product.minimumWholesaleQuantity) {
      finalQty = product.minimumWholesaleQuantity;
    }

    const compliance = isQuantityCompliant(product, finalQty);
    if (!compliance.compliant) {
      showToast(compliance.message || 'Quantité non valide', 'error');
      return { success: false, message: compliance.message };
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const currentItem = prev[existingIndex];
        const newTotalQty = currentItem.quantity + finalQty;

        if (newTotalQty > product.stock) {
          showToast(`Stock maximal atteint (${product.stock} pcs)`, 'error');
          return prev;
        }

        const unitPrice = calculateUnitPrice(product, newTotalQty);
        const updatedList = [...prev];
        updatedList[existingIndex] = {
          product,
          quantity: newTotalQty,
          unitPrice,
          subtotal: newTotalQty * unitPrice,
        };
        return updatedList;
      } else {
        const unitPrice = calculateUnitPrice(product, finalQty);
        return [
          ...prev,
          {
            product,
            quantity: finalQty,
            unitPrice,
            subtotal: finalQty * unitPrice,
          },
        ];
      }
    });

    showToast(`${product.name} ajouté au panier !`, 'success');
    return { success: true };
  };

  const updateCartQuantity = (
    productId: string,
    newQuantity: number
  ): { success: boolean; message?: string } => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return { success: false };

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const compliance = isQuantityCompliant(item.product, newQuantity);
    if (!compliance.compliant) {
      showToast(compliance.message || 'Quantité invalide', 'error');
      return { success: false, message: compliance.message };
    }

    setCart((prev) =>
      prev.map((i) => {
        if (i.product.id === productId) {
          const unitPrice = calculateUnitPrice(i.product, newQuantity);
          return {
            ...i,
            quantity: newQuantity,
            unitPrice,
            subtotal: newQuantity * unitPrice,
          };
        }
        return i;
      })
    );

    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Article retiré du panier', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Product mutations (Firestore or Demo fallback)
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (isFirebaseConfigured) {
      await FirebaseService.addProduct(productData);
    } else {
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    showToast(`Produit "${productData.name}" créé avec succès !`, 'success');
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (isFirebaseConfigured) {
      await FirebaseService.updateProduct(id, updates);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
      );
    }

    // Update in cart if present
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === id) {
          const updatedProduct = { ...item.product, ...updates };
          const unitPrice = calculateUnitPrice(updatedProduct, item.quantity);
          return {
            ...item,
            product: updatedProduct,
            unitPrice,
            subtotal: item.quantity * unitPrice,
          };
        }
        return item;
      })
    );

    showToast('Produit mis à jour !', 'success');
  };

  const deleteProduct = async (id: string) => {
    if (isFirebaseConfigured) {
      await FirebaseService.deleteProduct(id);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast('Produit supprimé.', 'info');
  };

  const updateStock = async (id: string, deltaOrValue: number, isAbsolute = false) => {
    const current = products.find((p) => p.id === id);
    if (!current) return;
    const newStock = Math.max(0, isAbsolute ? deltaOrValue : current.stock + deltaOrValue);

    if (isFirebaseConfigured) {
      await FirebaseService.updateStock(id, newStock);
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p
        )
      );
    }
  };

  const toggleProductActive = async (id: string) => {
    const current = products.find((p) => p.id === id);
    if (!current) return;
    const newActive = !current.isActive;

    if (isFirebaseConfigured) {
      await FirebaseService.updateProduct(id, { isActive: newActive });
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isActive: newActive, updatedAt: new Date().toISOString() } : p
        )
      );
    }
    showToast(newActive ? 'Produit visible au public' : 'Produit masqué du catalogue', 'info');
  };

  const resetDemoData = async () => {
    if (isFirebaseConfigured) {
      await FirebaseService.seedInitialFirestoreData();
      showToast('Catalogue initialisé dans Firestore.', 'success');
    } else {
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setSettings(INITIAL_SETTINGS);
      StorageService.saveProducts(INITIAL_PRODUCTS);
      StorageService.saveOrders(INITIAL_ORDERS);
      StorageService.saveSettings(INITIAL_SETTINGS);
      showToast('Données de démonstration réinitialisées.', 'success');
    }
  };

  // Orders
  const createOrder = async (orderData: {
    customerName: string;
    phone: string;
    city: string;
    area: string;
    deliveryNote: string;
    notes?: string;
    items: CartItem[];
  }): Promise<Order> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderToSave: Omit<Order, 'id'> = {
      orderNumber: `#GDS-${randomSuffix}`,
      customerName: orderData.customerName,
      phone: orderData.phone,
      city: orderData.city,
      area: orderData.area,
      deliveryNote: orderData.deliveryNote,
      notes: orderData.notes,
      items: orderData.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      total: orderData.items.reduce((sum, item) => sum + item.subtotal, 0),
      status: 'Nouvelle',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let created: Order;
    if (isFirebaseConfigured) {
      created = await FirebaseService.createOrder(orderToSave);
      // Deduct stock for ordered items
      for (const item of orderData.items) {
        await updateStock(item.product.id, -item.quantity, false);
      }
    } else {
      created = {
        ...orderToSave,
        id: `ord-${Date.now()}`,
      };
      setOrders((prev) => [created, ...prev]);
      orderData.items.forEach((item) => {
        updateStock(item.product.id, -item.quantity, false);
      });
    }

    return created;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (isFirebaseConfigured) {
      await FirebaseService.updateOrderStatus(orderId, status);
    } else {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status, updatedAt: new Date().toISOString() } : ord
        )
      );
    }
    showToast(`Commande mise à jour : ${status}`, 'success');
  };

  // Settings
  const updateSettings = async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    if (isFirebaseConfigured) {
      await FirebaseService.updateSettings(newSettings);
    } else {
      setSettings(newSettings);
    }
    showToast('Paramètres enregistrés !', 'success');
  };

  // Admin Auth via Firebase Authentication
  const loginAdmin = async (
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      // In local demo mode (when Firebase environment variables are absent)
      setIsAdminAuthenticated(true);
      showToast("Mode Démo Local actif", 'info');
      return { success: true };
    }

    const emailToUse = adminEmail || '';
    if (!emailToUse.trim()) {
      return {
        success: false,
        error:
          "Variable VITE_ADMIN_EMAIL non configurée dans l'environnement. Veuillez définir l'adresse e-mail de l'administrateur.",
      };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse.trim(), pass.trim());
      const uid = userCredential.user.uid;

      // Verify that this UID exists as a document in the `admins` collection
      const isAdminDoc = await FirebaseService.isUserAdmin(uid);
      if (!isAdminDoc) {
        await signOut(auth);
        setIsAdminAuthenticated(false);
        return {
          success: false,
          error: "Accès refusé : votre compte n'est pas enregistré comme administrateur dans la collection Firestore admins.",
        };
      }

      setIsAdminAuthenticated(true);
      showToast("Connexion réussie à l'espace propriétaire.", 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      let message = 'Mot de passe incorrect ou erreur d’authentification.';
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        message = 'Mot de passe administrateur incorrect.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Trop de tentatives échouées. Réessayez dans quelques instants.';
      } else if (err.message) {
        message = err.message;
      }
      return { success: false, error: message };
    }
  };

  // Change Admin Password in Firebase Authentication
  const changeAdminPassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      return {
        success: false,
        error: "Firebase n'est pas configuré. Impossible de modifier le mot de passe cloud.",
      };
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      return {
        success: false,
        error: "Aucun administrateur connecté.",
      };
    }

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPass.trim());
      await reauthenticateWithCredential(user, credential);

      // Update password in Firebase Authentication
      await updatePassword(user, newPass.trim());
      showToast('Mot de passe administrateur mis à jour sur Firebase !', 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Error changing admin password:', err);
      let message = 'Erreur lors de la modification du mot de passe.';
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        message = 'Le mot de passe actuel est incorrect.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Le nouveau mot de passe doit comporter au moins 6 caractères.';
      } else if (err.message) {
        message = err.message;
      }
      return { success: false, error: message };
    }
  };

  const logoutAdmin = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setIsAdminAuthenticated(false);
    showToast('Déconnexion effectuée.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView: handleSetCurrentView,
        adminTab,
        setAdminTab,
        navigateToProduct,
        isFirebaseActive: isFirebaseConfigured,
        currentUser,
        categories,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        products,
        activeProducts,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        toggleProductActive,
        resetDemoData,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        orders,
        createOrder,
        updateOrderStatus,
        settings,
        updateSettings,
        isAdminAuthenticated,
        loginAdmin,
        changeAdminPassword,
        logoutAdmin,
        isConditionsModalOpen,
        setIsConditionsModalOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
