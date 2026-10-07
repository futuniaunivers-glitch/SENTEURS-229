import { AppSettings, Order, Product } from '../types';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  DEMO_PRODUCTS: 'gds_demo_products_v2',
  DEMO_ORDERS: 'gds_demo_orders_v2',
  DEMO_SETTINGS: 'gds_demo_settings_v2',
  CART: 'gds_cart_v2',
};

/**
 * StorageService is strictly used as local fallback when Firebase
 * environment variables are absent (local demo mode).
 * No admin password or credentials are ever stored in the browser.
 */
export const StorageService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_PRODUCTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    StorageService.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save demo products:', e);
    }
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_ORDERS);
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
      localStorage.setItem(STORAGE_KEYS.DEMO_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save demo orders:', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_SETTINGS);
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
      localStorage.setItem(STORAGE_KEYS.DEMO_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save demo settings:', e);
    }
  },

  getCart(): any[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveCart(cart: any[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  },
};
