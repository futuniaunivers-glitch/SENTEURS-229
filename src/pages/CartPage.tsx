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
        <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Votre Panier est vide
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          Découvrez notre gamme de parfums, huiles concentrées et diffuseurs à prix de gros et détail.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('products')}
            className="py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm transition-colors"
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continuer mes achats</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Mon Panier ({cart.length} articles)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-medium transition-colors"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs divide-y divide-stone-100 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-center">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-200/80"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-snug truncate">
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
                    <span className="ml-1 text-amber-800 font-semibold">(Tarif grossiste appliqué)</span>
                  )}
                </p>

                <div className="mt-2.5 flex items-center justify-between">
                  {/* Stepper */}
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200 transition-colors"
                      aria-label="Moins"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-stone-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-40 transition-colors"
                      aria-label="Plus"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-base font-bold font-serif text-stone-950 tabular-nums">
                    {formatFCFA(item.subtotal)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Checkout button */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
            Total de la commande
          </h2>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Total Produits
              </span>
              <span className="text-2xl font-bold font-serif text-stone-950 tabular-nums">
                {formatFCFA(cartTotal)}
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              * Frais de livraison non inclus (réglés directement au livreur).
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
            <div className="font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>Conditions de commande</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Paiement Mobile Money / Moov Money exigé avant expédition. Pas de paiement marchandise à la livraison.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('checkout')}
            className="w-full py-4 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Passer à la validation</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
