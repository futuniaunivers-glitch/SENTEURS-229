import { AppSettings, Order, Product } from '../types';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'gds_products_v1',
  ORDERS: 'gds_orders_v1',
  SETTINGS: 'gds_settings_v1',
  CART: 'gds_cart_v1',
  AUTH: 'gds_auth_session_v1',
  ADMIN_PIN: 'gds_admin_pin_v1',
};

// Default secure PIN for the store owner
const DEFAULT_ADMIN_PIN = 'senteurs229';

export const StorageService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    // Seed initial products
    StorageService.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    StorageService.saveOrders(INITIAL_ORDERS);
    return INITIAL_ORDERS;
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    StorageService.saveSettings(INITIAL_SETTINGS);
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  // Auth management
  verifyAdminCredentials(password: string): boolean {
    const currentPin = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
    return password.trim() === currentPin.trim();
  },

  updateAdminPassword(oldPass: string, newPass: string): { success: boolean; message?: string } {
    if (!StorageService.verifyAdminCredentials(oldPass)) {
      return { success: false, message: 'Le mot de passe actuel est incorrect.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'Le nouveau mot de passe doit comporter au moins 4 caractères.' };
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPass.trim());
    return { success: true };
  },

  isAuthenticated(): boolean {
    try {
      const token = sessionStorage.getItem(STORAGE_KEYS.AUTH);
      return Boolean(token && token.startsWith('admin_token_'));
    } catch {
      return false;
    }
  },

  loginAdmin(): void {
    const token = `admin_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEYS.AUTH, token);
  },

  logoutAdmin(): void {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  },
};
