import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Layers, ShoppingBag, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount, setIsCartDrawerOpen } = useApp();

  const isCurrent = (view: string) => currentView === view;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EBE4D8] shadow-[0_-4px_16px_rgba(43,26,71,0.06)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 items-center h-16 px-1">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 rounded-xl ${
            isCurrent('home') ? 'text-violet-950 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-full ${isCurrent('home') ? 'bg-violet-100/70 text-violet-900' : ''}`}>
            <Home className={`w-5 h-5 ${isCurrent('home') ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Accueil</span>
        </button>

        <button
          onClick={() => setCurrentView('products')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 rounded-xl ${
            isCurrent('products') ? 'text-violet-950 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-full ${isCurrent('products') ? 'bg-violet-100/70 text-violet-900' : ''}`}>
            <Layers className={`w-5 h-5 ${isCurrent('products') ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Catalogue</span>
        </button>

        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] text-stone-700 active:scale-95 transition-all rounded-xl"
        >
          <div className="relative p-1">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-violet-900 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-medium">Panier</span>
        </button>

        <button
          onClick={() => setCurrentView('conditions')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 rounded-xl ${
            isCurrent('conditions') ? 'text-violet-950 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-full ${isCurrent('conditions') ? 'bg-violet-100/70 text-violet-900' : ''}`}>
            <ShieldCheck className={`w-5 h-5 ${isCurrent('conditions') ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Règles & Vente</span>
        </button>
      </div>
    </div>
  );
};
