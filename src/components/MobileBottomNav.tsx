import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Layers, ShoppingBag, ShieldCheck, MessageSquare } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount, setIsCartDrawerOpen } = useApp();

  const isCurrent = (view: string) => currentView === view;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F3EC]/95 backdrop-blur-md border-t border-[#E6DDD0] shadow-soft pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 items-center h-16">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] ${
            isCurrent('home') ? 'text-[#5B2A86] font-bold' : 'text-[#6B6177]'
          }`}
        >
          <Home className={`w-5 h-5 ${isCurrent('home') ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1">Accueil</span>
        </button>

        <button
          onClick={() => setCurrentView('products')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] ${
            isCurrent('products') ? 'text-[#5B2A86] font-bold' : 'text-[#6B6177]'
          }`}
        >
          <Layers className={`w-5 h-5 ${isCurrent('products') ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1">Catalogue</span>
        </button>

        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center h-full text-[#6B6177] hover:text-[#5B2A86] active:scale-95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#5B2A86] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-soft">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 font-medium">Panier</span>
        </button>

        <button
          onClick={() => setCurrentView('conditions')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] ${
            isCurrent('conditions') ? 'text-[#5B2A86] font-bold' : 'text-[#6B6177]'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 ${isCurrent('conditions') ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1">Règles & Vente</span>
        </button>
      </div>
    </div>
  );
};
