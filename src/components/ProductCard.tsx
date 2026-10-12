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
      className="group relative flex flex-col bg-white rounded-[20px] border border-[#E6DDD0] shadow-soft lg:hover:-translate-y-1 lg:hover:shadow-soft-hover transition-all duration-200 ease-out cursor-pointer overflow-hidden"
    >
      {/* Product Image Frame (ratio 4/5, fond beige) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EDE3D6]">
        {!imageError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#EDE3D6] text-[#6B6177]">
            <Sparkles className="h-10 w-10 stroke-1 text-[#6B6177]/40" />
          </div>
        )}

        {/* Stock Status Badge (Pilule) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-soft ${
              status.tone === 'available'
                ? 'bg-white/95 text-[#2E7D4F] border-[#2E7D4F]/30'
                : status.tone === 'low'
                ? 'bg-white/95 text-[#B7791F] border-[#B7791F]/30'
                : 'bg-white/95 text-[#B3261E] border-[#B3261E]/30'
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
        </div>

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-[#1F1630]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-[#1F1630] rounded-full text-xs font-semibold shadow-soft">
            <Eye className="w-3.5 h-3.5 text-[#5B2A86]" />
            Voir détails & tarifs
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4 justify-between">
        <div>
          {/* Category & Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B6177] mb-1 font-medium capitalize">
            <span>{product.categoryId}</span>
            {product.wholesaleEnabled && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#5B2A86] font-semibold">Gros disponible</span>
              </>
            )}
          </div>

          {/* Product Title (2 lines max, sans-serif) */}
          <h3 className="text-sm sm:text-base font-bold text-[#1F1630] leading-snug line-clamp-2 group-hover:text-[#5B2A86] transition-colors">
            {product.name}
          </h3>

          {/* Pricing Info */}
          <div className="mt-3 pt-2.5 border-t border-[#E6DDD0] space-y-1.5">
            {/* Retail price */}
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-[#6B6177]">
                {product.allowRetail ? 'Prix détail :' : 'Prix unitaire ref :'}
              </span>
              <span className="font-bold text-[#1F1630] text-sm sm:text-base tabular-nums">
                {formatFCFA(product.detailPrice)}
              </span>
            </div>

            {/* Wholesale highlights in light purple container */}
            {product.wholesaleEnabled && minWholesaleTier && (
              <div className="bg-[#EFE7F7] rounded-[12px] p-2 border border-[#5B2A86]/10">
                <div className="flex items-center justify-between text-xs text-[#5B2A86] font-semibold">
                  <span>Gros dès {minWholesaleTier.minQuantity} pcs</span>
                  <span className="font-bold tabular-nums">
                    {formatFCFA(minWholesaleTier.pricePerUnit)} / pce
                  </span>
                </div>
                {bestWholesaleTier && bestWholesaleTier.minQuantity > minWholesaleTier.minQuantity && (
                  <p className="text-[10px] text-[#4A2070] mt-0.5 font-medium">
                    Jusqu'à {formatFCFA(bestWholesaleTier.pricePerUnit)} / pce dès {bestWholesaleTier.minQuantity} pcs (douzaine)
                  </p>
                )}
              </div>
            )}

            {!product.allowRetail && product.wholesaleEnabled && (
              <div className="flex items-center gap-1 text-[11px] text-[#6B6177] mt-1 font-medium">
                <AlertCircle className="w-3 h-3 text-[#B7791F] shrink-0" />
                <span>Minimum commande : {product.minimumWholesaleQuantity} pièces</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Pill, violet, min 44px */}
        <div className="mt-3.5 pt-1">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full min-h-[44px] py-2.5 px-3 rounded-full bg-[#EDE3D6] text-[#6B6177] text-xs font-semibold cursor-not-allowed text-center"
            >
              Rupture de stock
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all duration-200 ease-out flex items-center justify-center gap-1.5 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            >
              <Plus className="w-4 h-4 text-white" />
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
