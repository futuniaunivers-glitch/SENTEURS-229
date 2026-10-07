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
        <span className="text-xs uppercase tracking-wider text-amber-900 font-bold">
          Catalogue & Vente en Gros
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Nos Parfums & Senteurs
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
          Sélectionnez vos articles pour profiter automatiquement des tarifs grossistes et dégressifs. Tarifs calculés en temps réel dès 3 pièces ou à la douzaine.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="🔎 Rechercher un produit (nom, senteur, type)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs (Segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/80'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200/60">
        <span>
          Affichage de <strong className="text-stone-800 font-semibold">{filteredProducts.length}</strong> produit{filteredProducts.length > 1 ? 's' : ''}
        </span>
        {searchQuery && (
          <span className="italic">
            Résultats pour "{searchQuery}"
          </span>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-stone-200 p-8">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
            <PackageSearch className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Aucun produit trouvé
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Nous n'avons trouvé aucun article correspondant à vos critères de recherche. Essayez d'autres mots-clés ou réinitialisez les filtres.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="py-2.5 px-4 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
