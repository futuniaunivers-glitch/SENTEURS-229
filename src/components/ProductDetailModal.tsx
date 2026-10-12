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
      className="fixed inset-0 z-50 overflow-y-auto bg-[#1F1630]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-t-[20px] sm:rounded-[20px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#E6DDD0]">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                status.tone === 'available'
                  ? 'bg-white text-[#2E7D4F] border-[#2E7D4F]/30'
                  : status.tone === 'low'
                  ? 'bg-white text-[#B7791F] border-[#B7791F]/30'
                  : 'bg-white text-[#B3261E] border-[#B3261E]/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status.tone === 'available'
                    ? 'bg-[#2E7D4F]'
                    : status.tone === 'low'
                    ? 'bg-[#B7791F]'
                    : 'bg-[#B3261E]'
                }`}
              />
              {status.label}
            </span>
            <span className="text-xs text-[#6B6177] capitalize">{product.categoryId}</span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-[#6B6177] hover:text-[#1F1630] hover:bg-[#EFE7F7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Photo & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div className="aspect-[4/5] sm:aspect-square rounded-[20px] overflow-hidden bg-[#EDE3D6] border border-[#E6DDD0]">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#1F1630] leading-tight">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#6B6177] leading-relaxed">
                {product.description}
              </p>

              {/* Retail price badge */}
              <div className="pt-2">
                <div className="text-xs text-[#6B6177] font-medium">Prix unitaire de base :</div>
                <div className="text-xl font-bold text-[#1F1630]">
                  {formatFCFA(product.detailPrice)}
                  <span className="text-xs text-[#6B6177] font-normal ml-1">/ pièce</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wholesale Pricing Table */}
          {product.wholesaleEnabled && tiers.length > 0 && (
            <div className="bg-[#EFE7F7] rounded-[20px] p-4 sm:p-5 border border-[#5B2A86]/15 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-[#5B2A86] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#5B2A86]" />
                  Tarifs grossistes & paliers dégressifs
                </h3>
                <span className="text-[11px] text-[#5B2A86] font-semibold">
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
                      className={`flex items-center justify-between p-2.5 rounded-[12px] transition-all text-xs sm:text-sm ${
                        isCurrent
                          ? 'bg-[#5B2A86] text-white font-bold shadow-soft'
                          : 'bg-white border border-[#E6DDD0] text-[#1F1630]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isCurrent ? 'bg-white' : 'bg-[#E6DDD0]'
                          }`}
                        />
                        <span>{rangeLabel}</span>
                      </div>
                      <div className="tabular-nums font-semibold">
                        {formatFCFA(tier.pricePerUnit)} / pièce
                        {isCurrent && (
                          <span className="ml-2 text-[10px] uppercase font-extrabold text-[#5B2A86] bg-white px-1.5 py-0.5 rounded-full">
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
                <p className="text-[11px] text-[#4A2070] font-semibold bg-white/70 p-2.5 rounded-[12px] border border-[#5B2A86]/10">
                  💡 Ajoutez {nextTier.minQuantity - quantity} pièce{nextTier.minQuantity - quantity > 1 ? 's' : ''} de plus pour débloquer le palier à {formatFCFA(nextTier.pricePerUnit)} / pièce !
                </p>
              )}
            </div>
          )}

          {/* Quantity Rule Warning if below minimum */}
          {!compliance.compliant && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-[12px] flex items-start gap-2.5 text-xs text-[#B3261E]">
              <AlertTriangle className="w-4 h-4 text-[#B3261E] shrink-0 mt-0.5" />
              <span>{compliance.message}</span>
            </div>
          )}

          {/* Interactive Quantity Selector & Price Summary */}
          <div className="bg-[#F8F3EC] p-4 rounded-[20px] border border-[#E6DDD0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1F1630] block">
                  Quantité souhaitée :
                </span>
                <span className="text-[11px] text-[#6B6177]">
                  {product.stock} pièces en stock
                </span>
              </div>

              {/* Quantity Stepper (min 40px buttons) */}
              <div className="flex items-center bg-white border border-[#E6DDD0] rounded-[12px] shadow-soft overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={isOutOfStock}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1F1630] hover:bg-[#EFE7F7] active:scale-[0.98] disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
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
                  className="w-14 h-10 text-center font-bold text-sm text-[#1F1630] border-x border-[#E6DDD0] focus:outline-none tabular-nums"
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1F1630] hover:bg-[#EFE7F7] active:scale-[0.98] disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calculated Total Display */}
            <div className="pt-3 border-t border-[#E6DDD0] flex items-baseline justify-between">
              <div>
                <div className="text-xs text-[#6B6177]">Total calculé :</div>
                <div className="text-xs font-semibold text-[#5B2A86]">
                  {quantity} × {formatFCFA(unitPrice)}
                </div>
              </div>
              <div className="text-2xl font-bold text-[#1F1630] tabular-nums">
                {formatFCFA(subtotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E6DDD0] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] py-3 px-5 rounded-full border border-[#E6DDD0] text-[#1F1630] text-xs sm:text-sm font-bold hover:bg-[#EFE7F7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || !compliance.compliant}
            className="flex-1 min-h-[44px] py-3 px-6 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] disabled:bg-[#EDE3D6] disabled:text-[#6B6177] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
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
