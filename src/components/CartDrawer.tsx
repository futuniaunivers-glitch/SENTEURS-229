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
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Votre Panier ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Cart Items or Empty state */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg font-bold text-stone-800">
                  Votre panier est vide
                </p>
                <p className="text-xs text-stone-500 max-w-xs">
                  Parcourez notre catalogue pour découvrir nos parfums, huiles et senteurs aux meilleurs tarifs.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('products');
                }}
                className="py-2.5 px-4 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Découvrir le catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  {/* Thumbnail */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200/60"
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
                        <span className="ml-1 text-amber-800 font-semibold">(Prix gros)</span>
                      )}
                    </div>

                    {/* Stepper & Subtotal */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200 transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-40 transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-stone-900 font-serif tabular-nums">
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
          <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-4">
            {/* Delivery reminder */}
            <div className="text-[11px] text-stone-600 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span>
                Frais de livraison réglés à la réception. Paiement préalable exigé pour la marchandise.
              </span>
            </div>

            {/* Total calculation */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                  Total produits
                </span>
                <span className="text-xl sm:text-2xl font-bold font-serif text-stone-950 tabular-nums">
                  {formatFCFA(cartTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Commander sur WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setIsConditionsModalOpen(true);
                }}
                className="w-full py-2 text-stone-500 hover:text-stone-800 text-[11px] font-medium transition-colors"
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
