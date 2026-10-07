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
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, deltaOrValue: number, isAbsolute?: boolean) => void;
  toggleProductActive: (id: string) => void;
  resetDemoData: () => void;

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
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

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
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gds_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    StorageService.isAuthenticated()
  );
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  // Sync products and orders to localStorage
  useEffect(() => {
    StorageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    StorageService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('gds_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Handle URL hash navigation for clean browser back/forward or direct links like #/admin
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

  // Update hash when currentView changes
  const handleSetCurrentView = (view: AppView) => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = `#/${view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const navigateToProduct = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  // Only active products are shown on public catalog
  const activeProducts = products.filter((p) => p.isActive);

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);

  // Add to cart with price engine and quantity check
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

    // Determine initial quantity: if item enforces a minimum (e.g. mini-format huiles minimum 6)
    // and requestedQuantity is 1, set to minimumWholesaleQuantity
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

  // Product mutations (Admin)
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produit "${newProduct.name}" créé avec succès !`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Also update in cart if present
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

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast('Produit supprimé.', 'info');
  };

  const updateStock = (id: string, deltaOrValue: number, isAbsolute = false) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, isAbsolute ? deltaOrValue : p.stock + deltaOrValue);
          return {
            ...p,
            stock: newStock,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newActive = !p.isActive;
          showToast(newActive ? 'Produit visible au public' : 'Produit masqué du catalogue', 'info');
          return {
            ...p,
            isActive: newActive,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    StorageService.saveProducts(INITIAL_PRODUCTS);
    StorageService.saveOrders(INITIAL_ORDERS);
    StorageService.saveSettings(INITIAL_SETTINGS);
    showToast('Données de démonstration réinitialisées.', 'success');
  };

  // Orders
  const createOrder = (orderData: {
    customerName: string;
    phone: string;
    city: string;
    area: string;
    deliveryNote: string;
    notes?: string;
    items: CartItem[];
  }): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
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

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock for ordered items
    orderData.items.forEach((item) => {
      updateStock(item.product.id, -item.quantity, false);
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    showToast(`Commande mise à jour : ${status}`, 'success');
  };

  // Settings
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }));
    showToast('Paramètres enregistrés !', 'success');
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    const valid = StorageService.verifyAdminCredentials(password);
    if (valid) {
      StorageService.loginAdmin();
      setIsAdminAuthenticated(true);
      showToast('Connexion réussie à l’espace propriétaire.', 'success');
      return true;
    } else {
      showToast('Mot de passe incorrect.', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    StorageService.logoutAdmin();
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
