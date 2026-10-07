export type CategoryId = 'all' | 'parfums' | 'huiles' | 'deodorants' | 'desodorisants' | 'diffuseurs' | 'autres';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

export interface WholesaleTier {
  minQuantity: number;
  pricePerUnit: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryId;
  description: string;
  imageUrl: string;
  stock: number;
  lowStockThreshold: number;
  detailPrice: number;
  wholesaleEnabled: boolean;
  minimumWholesaleQuantity: number;
  wholesaleTiers: WholesaleTier[];
  allowRetail: boolean;
  isActive: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'Nouvelle' | 'Confirmée' | 'En préparation' | 'Livrée' | 'Annulée';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  deliveryNote: string;
  notes?: string;
  acceptedTerms: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  deliveryNote: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  businessName: string;
  subtitle: string;
  phone: string;
  whatsappRaw: string;
  whatsappChannel: string;
  tiktok: string;
  facebook: string;
  googleMaps: string;
  salesConditions: {
    title: string;
    text: string;
    icon?: string;
  }[];
  deliveryInfo: string;
}
