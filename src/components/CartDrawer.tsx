import React from 'react';
import { useApp } from '../context/AppContext';
import { formatFCFA } from '../utils/pricing';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    setCurrentView,
    setIsConditionsModalOpen,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-[#1F1630]/60 backdrop-blur-xs flex items-end md:items-stretch md:justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-md bg-white max-h-[90vh] md:max-h-none md:h-full rounded-t-[20px] md:rounded-none shadow-2xl flex flex-col animate-in slide-in-from-bottom md:slide-in-from-right duration-200 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6DDD0]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#5B2A86]" />
            <h2 className="text-base sm:text-lg font-bold text-[#1F1630]">
              Votre Panier ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-[#6B6177] hover:text-[#1F1630] hover:bg-[#EFE7F7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Cart Items or Empty state */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-[12px] bg-[#EFE7F7] text-[#5B2A86] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base sm:text-lg font-bold text-[#1F1630]">
                  Votre panier est vide
                </p>
                <p className="text-xs text-[#6B6177] max-w-xs">
                  Parcourez notre catalogue pour découvrir nos parfums, huiles et senteurs aux meilleurs tarifs.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('products');
                }}
                className="min-h-[44px] py-2.5 px-6 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all duration-200 ease-out shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
              >
                Découvrir le catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[#E6DDD0]">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  {/* Thumbnail */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-[12px] object-cover bg-[#EDE3D6] shrink-0 border border-[#E6DDD0]"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-[#1F1630] leading-snug line-clamp-1">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#6B6177] hover:text-[#B3261E] transition-colors p-1.5 rounded-full hover:bg-rose-50"
                        aria-label="Supprimer cet article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#6B6177] mt-0.5">
                      {formatFCFA(item.unitPrice)} / pce
                      {item.product.wholesaleEnabled && item.quantity >= item.product.minimumWholesaleQuantity && (
                        <span className="ml-1 text-[#5B2A86] font-semibold">(Prix gros)</span>
                      )}
                    </div>

                    {/* Stepper (min 40px buttons) & Subtotal */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center border border-[#E6DDD0] rounded-[12px] overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1F1630] hover:bg-[#EFE7F7] active:scale-[0.98] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs sm:text-sm font-bold text-[#1F1630] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1F1630] hover:bg-[#EFE7F7] active:scale-[0.98] disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-sm sm:text-base font-bold text-[#1F1630] tabular-nums">
                        {formatFCFA(item.subtotal)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#F8F3EC] border-t border-[#E6DDD0] space-y-4">
            {/* Delivery reminder */}
            <div className="text-[11px] text-[#5B2A86] bg-[#EFE7F7] p-2.5 rounded-[12px] border border-[#5B2A86]/20 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5B2A86] shrink-0 mt-0.5" />
              <span>
                Frais de livraison réglés à la réception. Paiement préalable exigé pour la marchandise.
              </span>
            </div>

            {/* Total calculation (mis en évidence) */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-[#6B6177] font-semibold">
                  Total produits
                </span>
                <span className="text-2xl font-bold text-[#1F1630] tabular-nums">
                  {formatFCFA(cartTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons: Bouton violet pleine largeur */}
            <div className="space-y-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full min-h-[44px] sm:min-h-[48px] py-3.5 px-4 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
              >
                <span>Commander sur WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setIsConditionsModalOpen(true);
                }}
                className="w-full min-h-[44px] flex items-center justify-center py-2 text-[#6B6177] hover:text-[#5B2A86] text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
              >
                Consulter les conditions de vente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
