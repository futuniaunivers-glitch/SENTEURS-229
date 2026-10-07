import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, Sparkles, MessageCircle } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Brand mark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                GS
              </div>
              <div>
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-stone-900 block group-hover:text-amber-900 transition-colors leading-tight">
                  GROSSISTE DES SENTEURS 229
                </span>
                <span className="hidden sm:block text-[11px] text-stone-500 font-medium tracking-wide">
                  Vente en gros, semi-gros & détail Bénin
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => setCurrentView('home')}
              className={`transition-colors hover:text-stone-900 py-1 ${
                isCurrent('home') ? 'text-stone-950 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => setCurrentView('products')}
              className={`transition-colors hover:text-stone-900 py-1 ${
                isCurrent('products') ? 'text-stone-950 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Produits & Catalogue
            </button>
            <button
              onClick={() => setCurrentView('conditions')}
              className={`transition-colors hover:text-stone-900 py-1 ${
                isCurrent('conditions') ? 'text-stone-950 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Conditions de vente
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className={`transition-colors hover:text-stone-900 py-1 ${
                isCurrent('contact') ? 'text-stone-950 font-semibold border-b-2 border-stone-900' : ''
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
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp direct help */}
            <a
              href={`https://wa.me/${settings.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp direct"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assistance +229</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] shadow-sm"
              aria-label={`Panier avec ${cartCount} articles`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span>Panier</span>
              {cartCount > 0 ? (
                <span className="ml-0.5 px-1.5 py-0.2 bg-amber-400 text-stone-950 text-xs font-bold rounded-full">
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
