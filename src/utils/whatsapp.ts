import { CartItem, CustomerDetails } from '../types';
import { formatFCFA } from './pricing';

/**
 * Generate formatted WhatsApp order message as specified in Section 18
 */
export function generateWhatsAppOrderMessage(
  cartItems: CartItem[],
  customer: CustomerDetails,
  total: number
): string {
  const itemsText = cartItems
    .map((item) => `• ${item.product.name} × ${item.quantity} = ${formatFCFA(item.subtotal)}`)
    .join('\n');

  let message = `Bonjour Grossiste des Senteurs 229 👋🏽\n\n`;
  message += `Je souhaite passer une commande.\n\n`;
  message += `🛍️ PRODUITS\n\n`;
  message += `${itemsText}\n\n`;
  message += `💰 TOTAL PRODUITS :\n`;
  message += `${formatFCFA(total)}\n\n`;
  message += `👤 CLIENT\n\n`;
  message += `Nom : ${customer.fullName.trim()}\n`;
  message += `Téléphone : ${customer.phone.trim()}\n`;
  message += `Ville : ${customer.city.trim()}\n`;
  message += `Quartier : ${customer.area.trim()}\n`;
  message += `Indication de livraison : ${customer.deliveryNote.trim()}\n`;

  if (customer.notes && customer.notes.trim()) {
    message += `Note : ${customer.notes.trim()}\n`;
  }

  message += `\nJ'ai lu et compris les conditions de vente.\n\n`;
  message += `Merci.`;

  return message;
}

/**
 * Generate click-to-chat WhatsApp URL
 */
export function buildWhatsAppUrl(
  phoneRaw: string,
  message: string
): string {
  // Strip spaces, plus sign, hyphens
  const cleanPhone = phoneRaw.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
