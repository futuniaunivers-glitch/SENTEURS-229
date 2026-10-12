import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, MessageCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartDrawerOpen,
    settings,
  } = useApp();

  const isCurrent = (view: string) => currentView === view;

  return (
    <header className="sticky top-0 z-40 bg-[#F8F3EC]/90 backdrop-blur-md border-b border-[#E6DDD0] transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Brand mark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="text-left group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-xl p-1 -ml-1 transition-all"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] bg-[#5B2A86] text-white flex items-center justify-center text-sm sm:text-base font-extrabold shadow-soft shrink-0">
                GS
              </div>
              <div>
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#1F1630] block group-hover:text-[#5B2A86] transition-colors leading-tight">
                  GROSSISTE DES SENTEURS 229
                </span>
                <span className="hidden sm:block text-[11px] text-[#6B6177] font-medium tracking-wide">
                  Vente en gros, semi-gros & détail Bénin
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-[#6B6177]">
            <button
              onClick={() => setCurrentView('home')}
              className={`min-h-[44px] flex items-center transition-colors hover:text-[#5B2A86] py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md ${
                isCurrent('home') ? 'text-[#5B2A86] font-bold border-b-2 border-[#5B2A86]' : ''
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => setCurrentView('products')}
              className={`min-h-[44px] flex items-center transition-colors hover:text-[#5B2A86] py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md ${
                isCurrent('products') ? 'text-[#5B2A86] font-bold border-b-2 border-[#5B2A86]' : ''
              }`}
            >
              Produits & Catalogue
            </button>
            <button
              onClick={() => setCurrentView('conditions')}
              className={`min-h-[44px] flex items-center transition-colors hover:text-[#5B2A86] py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md ${
                isCurrent('conditions') ? 'text-[#5B2A86] font-bold border-b-2 border-[#5B2A86]' : ''
              }`}
            >
              Conditions de vente
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className={`min-h-[44px] flex items-center transition-colors hover:text-[#5B2A86] py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md ${
                isCurrent('contact') ? 'text-[#5B2A86] font-bold border-b-2 border-[#5B2A86]' : ''
              }`}
            >
              Contact & Réseaux
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick search shortcut on mobile */}
            <button
              onClick={() => setCurrentView('products')}
              aria-label="Rechercher"
              className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#6B6177] hover:text-[#5B2A86] hover:bg-[#EFE7F7] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp direct help */}
            <a
              href={`https://wa.me/${settings.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp direct"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs font-bold text-[#5B2A86] bg-[#EFE7F7] hover:bg-[#5B2A86] hover:text-white rounded-full transition-all duration-200 ease-out border border-[#5B2A86]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Assistance +229</span>
            </a>

            {/* Cart Button with purple badge */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-full bg-white hover:bg-[#EFE7F7] text-[#1F1630] border border-[#E6DDD0] text-xs sm:text-sm font-bold transition-all duration-200 ease-out btn-press shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
              aria-label={`Panier avec ${cartCount} articles`}
            >
              <ShoppingBag className="w-4 h-4 text-[#5B2A86]" />
              <span>Panier</span>
              {cartCount > 0 ? (
                <span className="ml-0.5 px-2 py-0.5 min-w-[20px] bg-[#5B2A86] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
