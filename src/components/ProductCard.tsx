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
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
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
          <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400">
            <Sparkles className="h-10 w-10 stroke-1 text-stone-300" />
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border backdrop-blur-md shadow-xs ${status.badgeColor}`}
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
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-stone-900 rounded-lg text-xs font-semibold shadow-md">
            <Eye className="w-3.5 h-3.5 text-stone-700" />
            Voir détails & tarifs
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-4.5 justify-between">
        <div>
          {/* Category & Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium capitalize">
            <span>{product.categoryId}</span>
            {product.wholesaleEnabled && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-800 font-semibold">Gros disponible</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-900 transition-colors">
            {product.name}
          </h3>

          {/* Pricing Info */}
          <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1">
            {/* Retail price */}
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-stone-500">
                {product.allowRetail ? 'Prix détail :' : 'Prix unitaire ref :'}
              </span>
              <span className="font-semibold text-stone-900 tabular-nums">
                {formatFCFA(product.detailPrice)}
              </span>
            </div>

            {/* Wholesale highlights */}
            {product.wholesaleEnabled && minWholesaleTier && (
              <div className="bg-amber-50/70 rounded-lg p-2 mt-1 border border-amber-100/80">
                <div className="flex items-center justify-between text-xs text-amber-950 font-semibold">
                  <span>Gros dès {minWholesaleTier.minQuantity} pcs</span>
                  <span className="text-amber-900 font-bold tabular-nums">
                    {formatFCFA(minWholesaleTier.pricePerUnit)} / pce
                  </span>
                </div>
                {bestWholesaleTier && bestWholesaleTier.minQuantity > minWholesaleTier.minQuantity && (
                  <p className="text-[10px] text-amber-800/90 mt-0.5">
                    Jusqu'à {formatFCFA(bestWholesaleTier.pricePerUnit)} / pce dès {bestWholesaleTier.minQuantity} pcs (douzaine)
                  </p>
                )}
              </div>
            )}

            {!product.allowRetail && product.wholesaleEnabled && (
              <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-1 font-medium">
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Minimum commande : {product.minimumWholesaleQuantity} pièces</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-2">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 text-stone-400 text-xs font-semibold cursor-not-allowed text-center"
            >
              Rupture de stock
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>
                {product.allowRetail ? 'Ajouter' : `Ajouter (${product.minimumWholesaleQuantity} pcs)`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
