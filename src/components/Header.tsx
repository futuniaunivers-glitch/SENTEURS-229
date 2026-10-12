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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE4D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Brand mark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="text-left group flex items-center gap-2.5 sm:gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-900 rounded-full pr-2"
            >
              <div className="w-10 h-10 rounded-full bg-violet-950 text-amber-200 flex items-center justify-center font-bold text-sm sm:text-base shadow-sm ring-2 ring-violet-200/50 shrink-0">
                GS
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-violet-950 block group-hover:text-violet-800 transition-colors leading-tight">
                  GROSSISTE DES SENTEURS 229
                </span>
                <span className="hidden sm:block text-[11px] text-stone-500 font-medium tracking-wide">
                  Vente en gros, semi-gros & détail Bénin
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-xs font-semibold text-stone-600">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-full transition-all min-h-[40px] ${
                isCurrent('home')
                  ? 'bg-violet-900 text-white shadow-xs'
                  : 'hover:text-violet-950 hover:bg-violet-50/80'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => setCurrentView('products')}
              className={`px-4 py-2 rounded-full transition-all min-h-[40px] ${
                isCurrent('products')
                  ? 'bg-violet-900 text-white shadow-xs'
                  : 'hover:text-violet-950 hover:bg-violet-50/80'
              }`}
            >
              Produits & Catalogue
            </button>
            <button
              onClick={() => setCurrentView('conditions')}
              className={`px-4 py-2 rounded-full transition-all min-h-[40px] ${
                isCurrent('conditions')
                  ? 'bg-violet-900 text-white shadow-xs'
                  : 'hover:text-violet-950 hover:bg-violet-50/80'
              }`}
            >
              Conditions de vente
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className={`px-4 py-2 rounded-full transition-all min-h-[40px] ${
                isCurrent('contact')
                  ? 'bg-violet-900 text-white shadow-xs'
                  : 'hover:text-violet-950 hover:bg-violet-50/80'
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
              className="md:hidden w-11 h-11 flex items-center justify-center text-stone-600 hover:text-violet-950 hover:bg-violet-50 rounded-full transition-colors active:scale-95"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp direct help */}
            <a
              href={`https://wa.me/${settings.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp direct"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors border border-emerald-200/80 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Assistance +229</span>
            </a>

            {/* Cart Button (Pill shaped) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-violet-900 hover:bg-violet-950 text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] shadow-sm min-h-[44px] min-w-[44px]"
              aria-label={`Panier avec ${cartCount} articles`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span>Panier</span>
              {cartCount > 0 ? (
                <span className="ml-0.5 px-2 py-0.5 bg-amber-300 text-violet-950 text-xs font-extrabold rounded-full shadow-xs">
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
