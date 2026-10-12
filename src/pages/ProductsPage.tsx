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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header & Title */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-violet-900 font-bold">
          Catalogue & Vente en Gros
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Nos Parfums & Senteurs
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Sélectionnez vos articles pour profiter automatiquement des tarifs grossistes et dégressifs. Tarifs calculés en temps réel dès 3 pièces ou à la douzaine.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        {/* Search Input (Pill shaped, 44px min height) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="🔎 Rechercher un produit (nom, senteur, type)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-11 py-3 bg-white border border-[#EDE8E0] rounded-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-900/15 focus:border-violet-900 transition-all shadow-xs min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-violet-950"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs (Horizontally scrolling pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[40px] flex items-center shrink-0 ${
                  isActive
                    ? 'bg-violet-900 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-violet-50 hover:text-violet-950 border border-[#EDE8E0]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-[#EDE8E0]">
        <span>
          Affichage de <strong className="text-violet-950 font-bold">{filteredProducts.length}</strong> produit{filteredProducts.length > 1 ? 's' : ''}
        </span>
        {searchQuery && (
          <span className="italic text-stone-600">
            Résultats pour "{searchQuery}"
          </span>
        )}
      </div>

      {/* Product Grid (2 columns on mobile, 3 to 4 on desktop) or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-[#EDE8E0] p-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-900 mx-auto flex items-center justify-center">
            <PackageSearch className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">
              Aucun produit trouvé
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Nous n'avons trouvé aucun article correspondant à vos critères de recherche. Essayez d'autres mots-clés ou réinitialisez les filtres.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="py-3 px-6 rounded-full bg-violet-900 text-white text-xs font-semibold hover:bg-violet-950 transition-colors min-h-[44px]"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
