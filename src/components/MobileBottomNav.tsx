import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Layers, ShoppingBag, ShieldCheck, MessageSquare } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount, setIsCartDrawerOpen } = useApp();

  const isCurrent = (view: string) => currentView === view;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 items-center h-16">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isCurrent('home') ? 'text-amber-900 font-semibold' : 'text-stone-500'
          }`}
        >
          <Home className={`w-5 h-5 ${isCurrent('home') ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1">Accueil</span>
        </button>

        <button
          onClick={() => setCurrentView('products')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isCurrent('products') ? 'text-amber-900 font-semibold' : 'text-stone-500'
          }`}
        >
          <Layers className={`w-5 h-5 ${isCurrent('products') ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1">Catalogue</span>
        </button>

        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center h-full text-stone-700 active:scale-95 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 font-medium">Panier</span>
        </button>

        <button
          onClick={() => setCurrentView('conditions')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isCurrent('conditions') ? 'text-amber-900 font-semibold' : 'text-stone-500'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 ${isCurrent('conditions') ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1">Règles & Vente</span>
        </button>
      </div>
    </div>
  );
};
