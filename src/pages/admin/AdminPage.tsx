import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { AdminTab } from '../../context/AppContext';

export const AdminPage: React.FC = () => {
  const {
    isAdminAuthenticated,
    logoutAdmin,
    adminTab,
    setAdminTab,
    setCurrentView,
    orders,
    products,
  } = useApp();

  // Guard: require authentication
  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  const unreadOrdersCount = orders.filter((o) => o.status === 'Nouvelle').length;
  const criticalStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  return (
    <div className="min-h-screen bg-stone-100/60 pb-16">
      {/* Admin Top Navigation */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold font-serif text-sm">
                GS
              </div>
              <div>
                <span className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                  Administration GDS 229
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold text-amber-300 bg-stone-800 px-2 py-0.5 rounded">
                  Espace Propriétaire
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Back to shop */}
              <button
                onClick={() => setCurrentView('home')}
                className="text-xs text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Consulter la boutique comme un client"
              >
                <span>Voir boutique</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* Logout button */}
              <button
                onClick={logoutAdmin}
                className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="border-t border-stone-800 bg-stone-950/80 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-2 py-1">
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                adminTab === 'dashboard'
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => setAdminTab('products')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                adminTab === 'products'
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Produits & Stocks</span>
              {criticalStockCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px] font-bold">
                  {criticalStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                adminTab === 'orders'
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Commandes</span>
              {unreadOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded-full text-[10px] font-bold">
                  {unreadOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                adminTab === 'settings'
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Paramètres</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};
