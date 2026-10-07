import { Product, WholesaleTier } from '../types';

/**
 * Format numbers as FCFA currency with French thousand separators
 * e.g., 15000 -> "15 000 FCFA"
 */
export function formatFCFA(amount: number): string {
  const rounded = Math.round(amount || 0);
  return new Intl.NumberFormat('fr-FR').format(rounded) + ' FCFA';
}

/**
 * Get sorted wholesale tiers (ascending by minQuantity)
 */
export function getSortedTiers(product: Product): WholesaleTier[] {
  if (!product.wholesaleEnabled || !product.wholesaleTiers) return [];
  return [...product.wholesaleTiers].sort((a, b) => a.minQuantity - b.minQuantity);
}

/**
 * Calculate applicable unit price for a given product and quantity
 */
export function calculateUnitPrice(product: Product, quantity: number): number {
  if (quantity <= 0) return product.detailPrice;

  const sortedTiers = getSortedTiers(product);
  
  if (sortedTiers.length > 0) {
    // Check if quantity meets any wholesale tier (search from highest tier down)
    for (let i = sortedTiers.length - 1; i >= 0; i--) {
      if (quantity >= sortedTiers[i].minQuantity) {
        return Math.round(sortedTiers[i].pricePerUnit);
      }
    }
  }

  // Fallback to retail price
  return Math.round(product.detailPrice);
}

/**
 * Find the currently active tier for the quantity
 */
export function getActiveTier(product: Product, quantity: number): WholesaleTier | null {
  const sortedTiers = getSortedTiers(product);
  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (quantity >= sortedTiers[i].minQuantity) {
      return sortedTiers[i];
    }
  }
  return null;
}

/**
 * Find the next tier to encourage volume purchases
 */
export function getNextTier(product: Product, quantity: number): WholesaleTier | null {
  const sortedTiers = getSortedTiers(product);
  for (const tier of sortedTiers) {
    if (quantity < tier.minQuantity) {
      return tier;
    }
  }
  return null;
}

/**
 * Check if the minimum quantity rule is satisfied
 */
export function isQuantityCompliant(product: Product, quantity: number): {
  compliant: boolean;
  message?: string;
} {
  if (quantity <= 0) {
    return { compliant: false, message: 'La quantité doit être supérieure à 0.' };
  }

  if (quantity > product.stock) {
    return {
      compliant: false,
      message: `Stock insuffisant. Maximum disponible : ${product.stock} pièce${product.stock > 1 ? 's' : ''}.`
    };
  }

  // If retail purchase is disabled for this item and order is below wholesale minimum
  if (!product.allowRetail && product.wholesaleEnabled && quantity < product.minimumWholesaleQuantity) {
    return {
      compliant: false,
      message: `⚠️ Quantité minimale non respectée. Le minimum pour cet article est de ${product.minimumWholesaleQuantity} pièces.`
    };
  }

  return { compliant: true };
}

/**
 * Get display availability label and tone
 */
export function getStockStatus(product: Product): {
  label: string;
  tone: 'available' | 'low' | 'out';
  badgeColor: string;
} {
  if (product.stock <= 0) {
    return {
      label: 'Rupture de stock',
      tone: 'out',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200'
    };
  }

  if (product.stock <= product.lowStockThreshold) {
    return {
      label: `Stock faible (${product.stock} restants)`,
      tone: 'low',
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
    };
  }

  return {
    label: 'Disponible',
    tone: 'available',
    badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200'
  };
}
