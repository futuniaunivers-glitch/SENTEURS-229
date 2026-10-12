import React from 'react';
import { useApp } from '../context/AppContext';
import { formatFCFA } from '../utils/pricing';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setCurrentView,
    setIsConditionsModalOpen,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-900 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Votre Panier est vide
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
          Découvrez notre gamme de parfums, huiles concentrées et diffuseurs à prix de gros et détail.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('products')}
            className="py-3 px-6 rounded-full bg-violet-900 hover:bg-violet-950 text-white font-semibold text-xs sm:text-sm transition-colors min-h-[44px]"
          >
            Voir tous les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentView('products')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-violet-950 transition-colors mb-2 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continuer mes achats</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Mon Panier ({cart.length} articles)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold transition-colors py-1 px-2"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EDE8E0] p-5 sm:p-6 shadow-xs divide-y divide-[#F0EBE1] space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-center">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover bg-[#F5F2EB] shrink-0 border border-[#EDE8E0]"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 leading-snug truncate">
                    {item.product.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-500 mt-0.5">
                  {formatFCFA(item.unitPrice)} / pièce
                  {item.product.wholesaleEnabled && item.quantity >= item.product.minimumWholesaleQuantity && (
                    <span className="ml-1 text-violet-900 font-bold">(Tarif grossiste appliqué)</span>
                  )}
                </p>

                <div className="mt-2.5 flex items-center justify-between">
                  {/* Stepper */}
                  <div className="flex items-center border border-stone-200 rounded-full overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-violet-950 hover:bg-violet-50 active:bg-violet-100 transition-colors"
                      aria-label="Moins"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-extrabold text-stone-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-violet-950 hover:bg-violet-50 active:bg-violet-100 disabled:opacity-40 transition-colors"
                      aria-label="Plus"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-base font-extrabold text-violet-950 tabular-nums">
                    {formatFCFA(item.subtotal)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Checkout button */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EDE8E0] p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-stone-900 border-b border-[#F0EBE1] pb-3">
            Total de la commande
          </h2>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-bold">
                Total Produits
              </span>
              <span className="text-2xl font-extrabold text-violet-950 tabular-nums">
                {formatFCFA(cartTotal)}
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              * Frais de livraison non inclus (réglés directement au livreur).
            </p>
          </div>

          <div className="p-3.5 bg-violet-50/80 rounded-2xl border border-violet-200/60 text-xs text-violet-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-800" />
              <span>Conditions de commande</span>
            </div>
            <p className="text-[11px] text-violet-900/90 leading-relaxed">
              Paiement Mobile Money / Moov Money exigé avant expédition. Pas de paiement marchandise à la livraison.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('checkout')}
            className="w-full py-4 px-6 rounded-full bg-violet-900 hover:bg-violet-950 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[48px]"
          >
            <span>Passer à la validation</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
