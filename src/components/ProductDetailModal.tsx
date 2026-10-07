import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import {
  calculateUnitPrice,
  formatFCFA,
  getActiveTier,
  getNextTier,
  getSortedTiers,
  getStockStatus,
  isQuantityCompliant,
} from '../utils/pricing';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Check, AlertTriangle, ShieldCheck, ShoppingBag } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  // Set initial quantity: minimum compliant quantity
  const initialQty = !product.allowRetail && product.wholesaleEnabled
    ? product.minimumWholesaleQuantity
    : 1;

  const [quantity, setQuantity] = useState<number>(initialQty);

  // Sync state if product changes
  useEffect(() => {
    const init = !product.allowRetail && product.wholesaleEnabled
      ? product.minimumWholesaleQuantity
      : 1;
    setQuantity(init);
  }, [product]);

  const status = getStockStatus(product);
  const tiers = getSortedTiers(product);
  const unitPrice = calculateUnitPrice(product, quantity);
  const subtotal = quantity * unitPrice;
  const activeTier = getActiveTier(product, quantity);
  const nextTier = getNextTier(product, quantity);
  const compliance = isQuantityCompliant(product, quantity);
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    const minPossible = !product.allowRetail && product.wholesaleEnabled
      ? product.minimumWholesaleQuantity
      : 1;
    if (quantity > minPossible) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleManualQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setQuantity(1);
    } else {
      setQuantity(Math.max(1, Math.min(val, product.stock)));
    }
  };

  const handleAddToCart = () => {
    if (!compliance.compliant || isOutOfStock) return;
    const res = addToCart(product, quantity);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.badgeColor}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status.tone === 'available'
                    ? 'bg-emerald-600'
                    : status.tone === 'low'
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                }`}
              />
              {status.label}
            </span>
            <span className="text-xs text-stone-500 capitalize">{product.categoryId}</span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Photo & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F5F2EB] border border-[#EDE8E0]">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Retail price badge */}
              <div className="pt-2">
                <div className="text-xs text-stone-500 font-medium">Prix unitaire de base :</div>
                <div className="text-2xl font-extrabold text-violet-950">
                  {formatFCFA(product.detailPrice)}
                  <span className="text-xs font-normal text-stone-500 ml-1">/ pièce</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wholesale Pricing Table */}
          {product.wholesaleEnabled && tiers.length > 0 && (
            <div className="bg-violet-50/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-violet-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-violet-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-violet-800" />
                  Tarifs grossistes & paliers dégressifs
                </h3>
                <span className="text-[11px] text-violet-800 font-semibold">
                  Calcul automatique
                </span>
              </div>

              <div className="space-y-2">
                {tiers.map((tier, idx) => {
                  const nextMin = idx < tiers.length - 1 ? tiers[idx + 1].minQuantity - 1 : null;
                  const rangeLabel = nextMin
                    ? `${tier.minQuantity}–${nextMin} pièces`
                    : `${tier.minQuantity}+ pièces (Douzaine / Gros)`;
                  const isCurrent = activeTier?.minQuantity === tier.minQuantity;

                  return (
                    <div
                      key={tier.minQuantity}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all text-xs sm:text-sm ${
                        isCurrent
                          ? 'bg-violet-900 text-white font-bold shadow-xs'
                          : 'bg-white/90 border border-violet-100 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-amber-300 shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-stone-300 shrink-0" />
                        )}
                        <span>{rangeLabel}</span>
                      </div>
                      <div className="tabular-nums font-semibold flex items-center gap-2">
                        <span>{formatFCFA(tier.pricePerUnit)} / pièce</span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-extrabold text-violet-950 bg-amber-300 px-2 py-0.5 rounded-full">
                            Appliqué
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upsell recommendation */}
              {nextTier && (
                <p className="text-[11px] text-violet-950 font-medium bg-violet-100/80 p-2.5 rounded-xl border border-violet-200/50">
                  💡 Ajoutez {nextTier.minQuantity - quantity} pièce{nextTier.minQuantity - quantity > 1 ? 's' : ''} de plus pour débloquer le palier à {formatFCFA(nextTier.pricePerUnit)} / pièce !
                </p>
              )}
            </div>
          )}

          {/* Quantity Rule Warning if below minimum */}
          {!compliance.compliant && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{compliance.message}</span>
            </div>
          )}

          {/* Interactive Quantity Selector & Price Summary */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#EDE8E0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  Quantité souhaitée :
                </span>
                <span className="text-[11px] text-stone-500">
                  {product.stock} pièces en stock
                </span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center bg-white border border-stone-200 rounded-full shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={isOutOfStock}
                  className="w-11 h-11 flex items-center justify-center text-stone-600 hover:text-violet-950 hover:bg-violet-50 active:bg-violet-100 disabled:opacity-40 transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleManualQuantityChange}
                  disabled={isOutOfStock}
                  className="w-14 h-11 text-center font-extrabold text-sm text-stone-900 border-x border-stone-200 focus:outline-none tabular-nums bg-transparent"
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="w-11 h-11 flex items-center justify-center text-stone-600 hover:text-violet-950 hover:bg-violet-50 active:bg-violet-100 disabled:opacity-40 transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calculated Total Display */}
            <div className="pt-3 border-t border-[#EBE4D8] flex items-baseline justify-between">
              <div>
                <div className="text-xs text-stone-500 font-medium">Total calculé :</div>
                <div className="text-xs font-semibold text-violet-900">
                  {quantity} × {formatFCFA(unitPrice)}
                </div>
              </div>
              <div className="text-2xl font-extrabold text-violet-950 tabular-nums">
                {formatFCFA(subtotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#F0EBE1] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-full border border-stone-200 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors min-h-[44px]"
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || !compliance.compliant}
            className="flex-1 py-3 px-5 rounded-full bg-violet-900 hover:bg-violet-950 disabled:bg-stone-300 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm min-h-[48px]"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>
              {isOutOfStock
                ? 'Rupture de stock'
                : `Ajouter au panier (${formatFCFA(subtotal)})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
