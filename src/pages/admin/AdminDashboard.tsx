import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatFCFA } from '../../utils/pricing';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, orders, setAdminTab, setSelectedProduct } = useApp();

  // Metrics
  const totalProducts = products.length;
  const availableCount = products.filter((p) => p.stock > p.lowStockThreshold).length;
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);

  // Critical products
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  );
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  // Recent 4 orders
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Products */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Catalogue</span>
            <Package className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-stone-900 tabular-nums">
            {totalProducts}
          </div>
          <p className="text-[11px] text-stone-500">Produits au total</p>
        </div>

        {/* Available */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-medium">
            <span>Disponibles</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-700 tabular-nums">
            {availableCount}
          </div>
          <p className="text-[11px] text-stone-500">Stock optimal</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-800 text-xs font-medium">
            <span>Stock faible</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-amber-800 tabular-nums">
            {lowStockCount}
          </div>
          <p className="text-[11px] text-stone-500">Sous le seuil d'alerte</p>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-rose-700 text-xs font-medium">
            <span>Ruptures</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-rose-700 tabular-nums">
            {outOfStockCount}
          </div>
          <p className="text-[11px] text-stone-500">Articles à 0 pièce</p>
        </div>

        {/* Total Orders */}
        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Commandes</span>
            <ShoppingBag className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-stone-900 tabular-nums">
            {totalOrders}
          </div>
          <p className="text-[11px] text-stone-500">{formatFCFA(totalRevenue)} total</p>
        </div>
      </div>

      {/* Critical Stock Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Out of Stock alerts */}
        <div className="bg-white rounded-3xl border border-rose-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base sm:text-lg font-bold text-rose-950 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Articles en Rupture de Stock ({outOfStockProducts.length})</span>
            </h2>
            <button
              onClick={() => setAdminTab('products')}
              className="text-xs text-rose-800 hover:underline font-semibold"
            >
              Gérer
            </button>
          </div>

          {outOfStockProducts.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-2">
              Aucun produit en rupture actuellement.
            </p>
          ) : (
            <div className="divide-y divide-stone-100 space-y-2.5">
              {outOfStockProducts.map((p) => (
                <div key={p.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-stone-900 truncate">{p.name}</p>
                      <span className="text-[11px] text-rose-600 font-bold">0 pièce restante</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAdminTab('products')}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-800 font-semibold text-[11px] transition-colors shrink-0"
                  >
                    Réapprovisionner
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock alerts */}
        <div className="bg-white rounded-3xl border border-amber-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Articles en Stock Faible ({lowStockProducts.length})</span>
            </h2>
            <button
              onClick={() => setAdminTab('products')}
              className="text-xs text-amber-800 hover:underline font-semibold"
            >
              Gérer
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-2">
              Aucun produit en stock critique.
            </p>
          ) : (
            <div className="divide-y divide-stone-100 space-y-2.5">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-stone-900 truncate">{p.name}</p>
                      <span className="text-[11px] text-amber-700 font-bold">
                        {p.stock} pièces restantes (seuil: {p.lowStockThreshold})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAdminTab('products')}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-800 font-semibold text-[11px] transition-colors shrink-0"
                  >
                    Ajuster
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-700" />
            <span>Dernières Commandes Reçues</span>
          </h2>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs text-stone-700 hover:text-stone-950 font-semibold flex items-center gap-1"
          >
            <span>Toutes les commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-stone-500 italic py-2">
            Aucune commande enregistrée pour l'instant.
          </p>
        ) : (
          <div className="divide-y divide-stone-100 space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{ord.orderNumber}</span>
                    <span className="text-stone-500">·</span>
                    <span className="font-medium text-stone-800">{ord.customerName}</span>
                    <span className="text-stone-400">({ord.city})</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {ord.items.length} article{ord.items.length > 1 ? 's' : ''} — {new Date(ord.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-stone-950 text-sm tabular-nums">
                    {formatFCFA(ord.total)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'Nouvelle'
                        ? 'bg-blue-100 text-blue-800'
                        : ord.status === 'Confirmée'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'En préparation'
                        ? 'bg-amber-100 text-amber-800'
                        : ord.status === 'Livrée'
                        ? 'bg-stone-100 text-stone-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
