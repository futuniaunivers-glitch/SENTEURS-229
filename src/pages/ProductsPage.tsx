import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, X, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { CategoryId } from '../types';

export const ProductsPage: React.FC = () => {
  const {
    activeProducts,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useApp();

  // Filter products by category and search query
  const filteredProducts = activeProducts.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' || product.categoryId === activeCategory;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.categoryId.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header & Title */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[#5B2A86] font-bold">
          Catalogue & Vente en Gros
        </span>
        <h1 className="text-section-title text-[#1F1630]">
          Nos Parfums & Senteurs
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6177] max-w-2xl leading-relaxed">
          Sélectionnez vos articles pour profiter automatiquement des tarifs grossistes et dégressifs. Tarifs calculés en temps réel dès 3 pièces ou à la douzaine.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        {/* Search Input (48px high, rounded 12px, violet ring) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6177]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="🔎 Rechercher un produit (nom, senteur, type)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-10 bg-white border border-[#E6DDD0] rounded-[12px] text-xs sm:text-sm text-[#1F1630] placeholder:text-[#6B6177] focus:outline-none focus:ring-2 focus:ring-[#5B2A86] focus:border-transparent transition-all shadow-soft"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B6177] hover:text-[#1F1630]"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs: Puces en pilule sur une seule ligne défilante horizontalement avec accroche (snap), sans barre de défilement visible */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`snap-start min-h-[44px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] shrink-0 ${
                  isActive
                    ? 'bg-[#5B2A86] text-white shadow-soft'
                    : 'bg-white text-[#1F1630] hover:text-[#5B2A86] border border-[#E6DDD0]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#6B6177] pt-2 border-t border-[#E6DDD0]">
        <span>
          Affichage de <strong className="text-[#1F1630] font-bold">{filteredProducts.length}</strong> produit{filteredProducts.length > 1 ? 's' : ''}
        </span>
        {searchQuery && (
          <span className="italic">
            Résultats pour "{searchQuery}"
          </span>
        )}
      </div>

      {/* Product Grid or Empty State: 2 colonnes mobile (écart 12 px), 3 cols md (écart 16 px), 4 cols lg (écart 16 à 24 px) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white rounded-[20px] border border-[#E6DDD0] p-8 shadow-soft">
          <div className="w-16 h-16 rounded-[12px] bg-[#EFE7F7] text-[#5B2A86] mx-auto flex items-center justify-center">
            <PackageSearch className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#1F1630]">
              Aucun produit trouvé
            </h3>
            <p className="text-xs text-[#6B6177] max-w-sm mx-auto">
              Nous n'avons trouvé aucun article correspondant à vos critères de recherche. Essayez d'autres mots-clés ou réinitialisez les filtres.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="min-h-[44px] py-2.5 px-6 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white text-xs font-bold transition-all duration-200 ease-out shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
