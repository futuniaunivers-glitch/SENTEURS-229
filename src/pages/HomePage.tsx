import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Truck,
  ShieldCheck,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { CategoryId } from '../types';

export const HomePage: React.FC = () => {
  const {
    activeProducts,
    categories,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setCurrentView,
    settings,
  } = useApp();

  const handleCategoryClick = (catId: CategoryId) => {
    setActiveCategory(catId);
    setCurrentView('products');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('products');
  };

  // Featured 4-6 products
  const featuredProducts = activeProducts.slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#2E0854] via-[#3B0764] to-[#1E0538] text-white overflow-hidden py-12 sm:py-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl sm:rounded-b-4xl shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-violet-200 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{settings.subtitle}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
            {settings.businessName}
          </h1>

          <p className="text-stone-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Votre référence au Bénin pour la vente de senteurs de luxe en{' '}
            <span className="text-amber-300 font-bold">gros</span>,{' '}
            <span className="text-amber-300 font-bold">semi-gros</span> et{' '}
            <span className="text-amber-300 font-bold">détail</span>. Tarifs dégressifs transparents et commande directe sur WhatsApp.
          </p>

          {/* Search Bar (Pill shaped) */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto pt-2 flex items-center bg-white rounded-full p-1.5 shadow-2xl border border-white/40"
          >
            <div className="pl-4 text-stone-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un parfum, huile, diffuseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 bg-transparent placeholder:text-stone-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 sm:px-6 py-2.5 rounded-full bg-violet-900 hover:bg-violet-950 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 min-h-[44px]"
            >
              Rechercher
            </button>
          </form>

          {/* Trust points */}
          <div className="pt-4 grid grid-cols-3 gap-2 max-w-lg mx-auto text-[11px] sm:text-xs text-stone-300">
            <div className="flex items-center justify-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Paliers de gros dès 3 pcs</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Qualité & Senteurs pures</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Livraison partout au Bénin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-violet-900 font-bold">
              Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Découvrez nos catégories
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('products')}
            className="text-xs font-semibold text-violet-950 hover:text-violet-800 flex items-center gap-1 group transition-colors py-1.5 px-3 rounded-full hover:bg-violet-50"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Categories: horizontal scrollable pills on mobile, clean cards on desktop */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories
            .filter((c) => c.id !== 'all')
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group shrink-0 sm:shrink p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EDE8E0] hover:border-violet-300 hover:shadow-md transition-all text-left flex flex-col justify-between min-w-[140px] sm:min-w-0 sm:h-28 active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-50 group-hover:bg-violet-100 text-violet-900 flex items-center justify-center transition-colors mb-2 sm:mb-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-violet-900 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-stone-400 line-clamp-1">
                    {cat.description}
                  </span>
                </div>
              </button>
            ))}
        </div>
      </section>

      {/* Featured Products Section (2 cols on mobile, 3-4 on desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-violet-900 font-bold">
              Catalogue Sélectif
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Produits disponibles & Tarifs dégressifs
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('products')}
            className="hidden sm:flex text-xs font-semibold text-violet-950 hover:text-violet-800 items-center gap-1 group transition-colors py-1.5 px-3 rounded-full hover:bg-violet-50"
          >
            <span>Explorer tous les produits</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Products Grid: 2 columns on mobile, 3 to 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="pt-4 text-center sm:hidden">
          <button
            onClick={() => setCurrentView('products')}
            className="w-full py-3.5 px-5 rounded-full bg-violet-900 hover:bg-violet-950 text-white text-xs font-semibold shadow-sm min-h-[44px]"
          >
            Voir tous les produits ({activeProducts.length})
          </button>
        </div>
      </section>

      {/* Commercial Policy Highlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2D0A4E] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-violet-900/50 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Vente professionnelle
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Vente en gros, semi-gros et détail
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Que vous soyez revendeur à Cotonou, commerçant en ligne, ou particulier cherchant vos senteurs préférées, notre système calcule automatiquement le meilleur tarif en fonction du nombre de pièces sélectionnées.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentView('products')}
                className="py-3 px-6 rounded-full bg-amber-300 hover:bg-amber-200 text-violet-950 font-bold text-xs sm:text-sm transition-colors shadow-sm min-h-[44px]"
              >
                Voir tous les produits
              </button>
              <button
                onClick={() => setCurrentView('conditions')}
                className="py-3 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors border border-white/20 min-h-[44px]"
              >
                Règles de commande
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Channel Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/80 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-950">
                📢 Rejoignez notre chaîne WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                Recevez nos nouveautés, arrivages exclusifs et informations en temps réel directement sur WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={settings.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all text-center shrink-0 shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>Rejoindre la chaîne</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};
