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
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-900 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Votre Panier ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Cart Items or Empty state */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-900 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-stone-900">
                  Votre panier est vide
                </p>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Parcourez notre catalogue pour découvrir nos parfums, huiles et senteurs aux meilleurs tarifs.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('products');
                }}
                className="py-3 px-6 rounded-full bg-violet-900 text-white text-xs font-semibold hover:bg-violet-950 transition-colors min-h-[44px]"
              >
                Découvrir le catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[#F0EBE1]">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  {/* Thumbnail */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover bg-[#F5F2EB] shrink-0 border border-[#EDE8E0]"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug line-clamp-1">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Supprimer cet article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {formatFCFA(item.unitPrice)} / pce
                      {item.product.wholesaleEnabled && item.quantity >= item.product.minimumWholesaleQuantity && (
                        <span className="ml-1 text-violet-900 font-bold">(Prix gros)</span>
                      )}
                    </div>

                    {/* Stepper & Subtotal */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-full overflow-hidden bg-white shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-violet-950 hover:bg-violet-50 active:bg-violet-100 transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-stone-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-violet-950 hover:bg-violet-50 active:bg-violet-100 disabled:opacity-40 transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-extrabold text-violet-950 tabular-nums">
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
          <div className="p-5 bg-[#FAF7F2] border-t border-[#EDE8E0] space-y-4">
            {/* Delivery reminder */}
            <div className="text-[11px] text-violet-950 bg-violet-50/80 p-3 rounded-2xl border border-violet-200/60 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-800 shrink-0 mt-0.5" />
              <span>
                Frais de livraison réglés à la réception. Paiement préalable exigé pour la marchandise.
              </span>
            </div>

            {/* Total calculation */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-bold">
                  Total produits
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-violet-950 tabular-nums">
                  {formatFCFA(cartTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-violet-900 hover:bg-violet-950 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm min-h-[48px]"
              >
                <span>Commander sur WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setIsConditionsModalOpen(true);
                }}
                className="w-full py-2.5 text-stone-500 hover:text-violet-950 text-[11px] font-medium transition-colors min-h-[40px]"
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
