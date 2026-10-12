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
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative bg-[#5B2A86] text-white overflow-hidden py-12 sm:py-20 px-4 sm:px-8 rounded-[20px] shadow-soft text-center">
          {/* Subtle ambient lighting */}
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-[#4A2070] rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7F7]/20 border border-white/20 text-[#EFE7F7] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.subtitle}</span>
            </div>

            <h1 className="text-main-title text-white tracking-tight text-balance">
              {settings.businessName}
            </h1>

            <p className="text-[#EFE7F7] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Votre référence au Bénin pour la vente de senteurs de luxe en{' '}
              <span className="text-white font-bold underline decoration-[#EFE7F7]/60 underline-offset-4">gros</span>,{' '}
              <span className="text-white font-bold underline decoration-[#EFE7F7]/60 underline-offset-4">semi-gros</span> et{' '}
              <span className="text-white font-bold underline decoration-[#EFE7F7]/60 underline-offset-4">détail</span>. Tarifs dégressifs transparents et commande directe sur WhatsApp.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-xl mx-auto pt-2 flex items-center bg-white rounded-[12px] p-1.5 shadow-soft border border-[#E6DDD0]"
            >
              <div className="pl-3.5 text-[#6B6177]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un parfum, huile, diffuseur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm text-[#1F1630] bg-transparent placeholder:text-[#6B6177] focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 sm:px-6 py-2.5 min-h-[44px] rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all duration-200 ease-out shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
              >
                Rechercher
              </button>
            </form>

            {/* Trust points */}
            <div className="pt-4 grid grid-cols-3 gap-2 max-w-lg mx-auto text-[11px] sm:text-xs text-[#EFE7F7] font-medium">
              <div className="flex items-center justify-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-[#EFE7F7] shrink-0" />
                <span>Paliers de gros dès 3 pcs</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#EFE7F7] shrink-0" />
                <span>Qualité & Senteurs pures</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Truck className="w-4 h-4 text-[#EFE7F7] shrink-0" />
                <span>Livraison partout au Bénin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#5B2A86] font-bold">
              Collections
            </span>
            <h2 className="text-section-title text-[#1F1630]">
              Découvrez nos catégories
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('products')}
            className="text-xs font-semibold text-[#6B6177] hover:text-[#5B2A86] min-h-[44px] flex items-center gap-1 group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Compact Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories
            .filter((c) => c.id !== 'all')
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group p-4 rounded-[20px] bg-white border border-[#E6DDD0] hover:border-[#5B2A86] hover:shadow-soft transition-all duration-200 text-left flex flex-col justify-between h-28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
              >
                <div className="w-8 h-8 rounded-[12px] bg-[#EFE7F7] group-hover:bg-[#5B2A86] text-[#5B2A86] group-hover:text-white flex items-center justify-center transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1F1630] group-hover:text-[#5B2A86] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-[#6B6177] line-clamp-1">
                    {cat.description}
                  </span>
                </div>
              </button>
            ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#5B2A86] font-bold">
              Catalogue Sélectif
            </span>
            <h2 className="text-section-title text-[#1F1630]">
              Produits disponibles & Tarifs dégressifs
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('products')}
            className="hidden sm:flex text-xs font-semibold text-[#6B6177] hover:text-[#5B2A86] min-h-[44px] items-center gap-1 group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
          >
            <span>Explorer tous les produits</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Products Grid: 2 cols mobile (gap 12px), 3 cols md, 4 cols lg (gap 16-24px) */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="pt-4 text-center sm:hidden">
          <button
            onClick={() => setCurrentView('products')}
            className="w-full min-h-[44px] py-3 px-4 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white text-xs font-bold transition-all duration-200 ease-out shadow-soft"
          >
            Voir tous les produits ({activeProducts.length})
          </button>
        </div>
      </section>

      {/* Commercial Policy Highlight Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EDE3D6] text-[#1F1630] rounded-[20px] p-6 sm:p-10 shadow-soft border border-[#E6DDD0] relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B2A86]">
              Vente professionnelle
            </span>
            <h2 className="text-section-title text-[#1F1630] leading-tight">
              Vente en gros, semi-gros et détail
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6177] leading-relaxed">
              Que vous soyez revendeur à Cotonou, commerçant en ligne, ou particulier cherchant vos senteurs préférées, notre système calcule automatiquement le meilleur tarif en fonction du nombre de pièces sélectionnées.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentView('products')}
                className="min-h-[44px] py-2.5 px-6 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all duration-200 ease-out shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
              >
                Voir tous les produits
              </button>
              <button
                onClick={() => setCurrentView('conditions')}
                className="min-h-[44px] py-2.5 px-5 rounded-full bg-white hover:bg-[#EFE7F7] active:scale-[0.98] text-[#1F1630] font-bold text-xs sm:text-sm transition-all duration-200 ease-out border border-[#E6DDD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
              >
                Règles de commande
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Channel Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#E6DDD0] shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[12px] bg-[#25D366]/15 text-[#2E7D4F] flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-[#1F1630]">
                📢 Rejoignez notre chaîne WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6177] leading-relaxed">
                Recevez nos nouveautés, arrivages exclusifs et informations en temps réel directement sur WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={settings.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto min-h-[44px] py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all duration-200 ease-out text-center shrink-0 shadow-soft flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <span>Rejoindre la chaîne</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};
