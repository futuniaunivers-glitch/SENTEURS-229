import React, { useState } from 'react';
import { Product } from '../types';
import { formatFCFA, getSortedTiers, getStockStatus } from '../utils/pricing';
import { useApp } from '../context/AppContext';
import { Plus, Eye, Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart } = useApp();
  const [imageError, setImageError] = useState(false);

  const status = getStockStatus(product);
  const tiers = getSortedTiers(product);
  const isOutOfStock = product.stock <= 0;

  // Wholesale highlights
  const minWholesaleTier = tiers.length > 0 ? tiers[0] : null;
  const bestWholesaleTier = tiers.length > 0 ? tiers[tiers.length - 1] : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    // Add default compliant quantity
    const defaultQty = !product.allowRetail && product.wholesaleEnabled
      ? product.minimumWholesaleQuantity
      : 1;
    addToCart(product, defaultQty);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-[#EDE8E0] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-900"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F2EB]">
        {!imageError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F5F2EB] text-stone-400">
            <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 stroke-1 text-stone-300" />
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
          <span
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold border backdrop-blur-md shadow-xs ${status.badgeColor}`}
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
        </div>

        {/* Quick View Overlay on Desktop */}
        <div className="hidden sm:flex absolute inset-0 bg-violet-950/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/95 text-violet-950 rounded-full text-xs font-semibold shadow-md">
            <Eye className="w-3.5 h-3.5 text-violet-900" />
            Voir détails & tarifs
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4.5 justify-between gap-3">
        <div>
          {/* Category & Wholesale indicator */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-stone-500 mb-1 font-medium capitalize">
            <span className="truncate">{product.categoryId}</span>
            {product.wholesaleEnabled && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-violet-900 font-bold shrink-0">Gros dispo</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-violet-900 transition-colors">
            {product.name}
          </h3>

          {/* Pricing Info */}
          <div className="mt-2 sm:mt-2.5 pt-2 border-t border-[#F0EBE1] space-y-1">
            {/* Retail price */}
            <div className="flex items-baseline justify-between text-[11px] sm:text-xs">
              <span className="text-stone-500 truncate mr-1">
                {product.allowRetail ? 'Prix détail :' : 'Réf unitaire :'}
              </span>
              <span className="font-extrabold text-stone-900 tabular-nums shrink-0">
                {formatFCFA(product.detailPrice)}
              </span>
            </div>

            {/* Wholesale highlights */}
            {product.wholesaleEnabled && minWholesaleTier && (
              <div className="bg-violet-50/70 rounded-xl p-1.5 sm:p-2 mt-1 border border-violet-100/90">
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-violet-950 font-semibold">
                  <span>Dès {minWholesaleTier.minQuantity} pcs</span>
                  <span className="text-violet-900 font-bold tabular-nums">
                    {formatFCFA(minWholesaleTier.pricePerUnit)} / pce
                  </span>
                </div>
                {bestWholesaleTier && bestWholesaleTier.minQuantity > minWholesaleTier.minQuantity && (
                  <p className="hidden sm:block text-[10px] text-violet-800/90 mt-0.5">
                    Jusqu'à {formatFCFA(bestWholesaleTier.pricePerUnit)} / pce dès {bestWholesaleTier.minQuantity} pcs
                  </p>
                )}
              </div>
            )}

            {!product.allowRetail && product.wholesaleEnabled && (
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-stone-600 mt-1 font-medium">
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate">Min : {product.minimumWholesaleQuantity} pièces</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button (Pill shaped, prominent, 44px min touch target) */}
        <div className="pt-1">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full min-h-[44px] py-2 px-3 rounded-full bg-stone-100 text-stone-400 text-xs font-semibold cursor-not-allowed text-center"
            >
              Rupture
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-full bg-violet-900 hover:bg-violet-950 active:scale-[0.98] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-950"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span className="truncate">
                {product.allowRetail ? 'Ajouter' : `Ajouter (${product.minimumWholesaleQuantity} pcs)`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
