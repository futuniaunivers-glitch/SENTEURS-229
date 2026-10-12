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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-[12px] bg-[#EFE7F7] text-[#5B2A86] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-section-title text-[#1F1630]">
          Votre Panier est vide
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6177] max-w-sm mx-auto leading-relaxed">
          Découvrez notre gamme de parfums, huiles concentrées et diffuseurs à prix de gros et détail.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('products')}
            className="min-h-[44px] py-3 px-6 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all duration-200 ease-out shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
          >
            Voir tous les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentView('products')}
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-[#6B6177] hover:text-[#5B2A86] transition-colors mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continuer mes achats</span>
          </button>
          <h1 className="text-section-title text-[#1F1630]">
            Mon Panier ({cart.length} articles)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="min-h-[44px] flex items-center text-xs text-[#B3261E] hover:underline font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3261E] rounded-md"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-7 bg-white rounded-[20px] border border-[#E6DDD0] p-5 sm:p-6 shadow-soft divide-y divide-[#E6DDD0] space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-center">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-[12px] object-cover bg-[#EDE3D6] shrink-0 border border-[#E6DDD0]"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#1F1630] leading-snug truncate">
                    {item.product.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[#6B6177] hover:text-[#B3261E] transition-colors p-1.5 rounded-full hover:bg-rose-50"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#6B6177] mt-0.5">
                  {formatFCFA(item.unitPrice)} / pièce
                  {item.product.wholesaleEnabled && item.quantity >= item.product.minimumWholesaleQuantity && (
                    <span className="ml-1 text-[#5B2A86] font-semibold">(Tarif grossiste appliqué)</span>
                  )}
                </p>

                <div className="mt-2.5 flex items-center justify-between">
                  {/* Stepper with min 40px buttons */}
                  <div className="flex items-center border border-[#E6DDD0] rounded-[12px] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1F1630] hover:bg-[#EFE7F7] active:scale-[0.98] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
                      aria-label="Moins"
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
                      aria-label="Plus"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-base font-bold text-[#1F1630] tabular-nums">
                    {formatFCFA(item.subtotal)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Checkout button */}
        <div className="lg:col-span-5 bg-white rounded-[20px] border border-[#E6DDD0] p-6 shadow-soft space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-[#1F1630] border-b border-[#E6DDD0] pb-3">
            Total de la commande
          </h2>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-[#6B6177] font-semibold">
                Total Produits
              </span>
              <span className="text-2xl font-bold text-[#1F1630] tabular-nums">
                {formatFCFA(cartTotal)}
              </span>
            </div>
            <p className="text-[11px] text-[#6B6177]">
              * Frais de livraison non inclus (réglés directement au livreur).
            </p>
          </div>

          <div className="p-3 bg-[#EFE7F7] rounded-[12px] border border-[#5B2A86]/15 text-xs text-[#5B2A86] space-y-1">
            <div className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#5B2A86]" />
              <span>Conditions de commande</span>
            </div>
            <p className="text-[11px] text-[#5B2A86] leading-relaxed">
              Paiement Mobile Money / Moov Money exigé avant expédition. Pas de paiement marchandise à la livraison.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('checkout')}
            className="w-full min-h-[44px] sm:min-h-[48px] py-4 px-6 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
          >
            <span>Passer à la validation</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
