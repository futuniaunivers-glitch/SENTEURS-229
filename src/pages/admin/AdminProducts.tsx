import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatFCFA, getStockStatus } from '../../utils/pricing';
import { Product } from '../../types';
import { AdminProductModal } from './AdminProductModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Minus,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const {
    products,
    updateStock,
    toggleProductActive,
    deleteProduct,
    categories,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryId.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${name}" ?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            Gestion du Catalogue ({products.length} articles)
          </h2>
          <p className="text-xs text-stone-500">
            Modifiez les prix, ajustez les stocks en un clic et gérez la visibilité en direct.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none"
        >
          <option value="all">Toutes les catégories</option>
          {categories
            .filter((c) => c.id !== 'all')
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Prix Détail</th>
                <th className="py-3.5 px-4">Paliers Gros</th>
                <th className="py-3.5 px-4">Stock en direct</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const status = getStockStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-stone-900 leading-tight">{p.name}</p>
                          <p className="text-[11px] text-stone-500 line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 capitalize text-stone-600 font-medium">
                      {p.categoryId}
                    </td>

                    {/* Retail Price */}
                    <td className="py-3 px-4 font-semibold text-stone-900 tabular-nums">
                      {formatFCFA(p.detailPrice)}
                    </td>

                    {/* Wholesale */}
                    <td className="py-3 px-4">
                      {p.wholesaleEnabled && p.wholesaleTiers?.length > 0 ? (
                        <div className="space-y-0.5">
                          <span className="font-bold text-amber-900">
                            Dès {p.wholesaleTiers[0].minQuantity} pcs : {formatFCFA(p.wholesaleTiers[0].pricePerUnit)}
                          </span>
                          <p className="text-[10px] text-stone-500">
                            {p.wholesaleTiers.length} paliers configurés
                          </p>
                        </div>
                      ) : (
                        <span className="text-stone-400">Non activé</span>
                      )}
                    </td>

                    {/* Quick Stock Controls */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => updateStock(p.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200"
                            title="Diminuer stock (-1)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-bold text-stone-900 tabular-nums">
                            {p.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateStock(p.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200"
                            title="Ajouter stock (+1)"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Quick +10 batch addition */}
                        <button
                          type="button"
                          onClick={() => updateStock(p.id, 10)}
                          className="px-1.5 py-1 text-[10px] font-bold bg-stone-100 hover:bg-stone-200 rounded text-stone-700"
                          title="Ajouter 10 pièces"
                        >
                          +10
                        </button>
                      </div>

                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                            status.tone === 'available'
                              ? 'text-emerald-700'
                              : status.tone === 'low'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              status.tone === 'available'
                                ? 'bg-emerald-600'
                                : status.tone === 'low'
                                ? 'bg-amber-600'
                                : 'bg-rose-600'
                            }`}
                          />
                          {status.label}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductActive(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                        title="Cliquer pour activer/masquer"
                      >
                        {p.isActive ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                            <span>Masqué</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="lg:hidden divide-y divide-stone-100">
          {filteredProducts.map((p) => {
            const status = getStockStatus(p);
            return (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-sm text-stone-900 leading-tight">
                        {p.name}
                      </h3>
                      <button
                        onClick={() => toggleProductActive(p.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {p.isActive ? 'Visible' : 'Masqué'}
                      </button>
                    </div>

                    <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                      <span className="capitalize">{p.categoryId}</span>
                      <span>·</span>
                      <span className="font-semibold text-stone-900">
                        {formatFCFA(p.detailPrice)}
                      </span>
                    </div>

                    <div className="mt-1">
                      <span
                        className={`text-[11px] font-bold ${
                          status.tone === 'available'
                            ? 'text-emerald-700'
                            : status.tone === 'low'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        Stock : {p.stock} pcs ({status.label})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stock & Edit Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-500 font-medium">Ajuster :</span>
                    <button
                      type="button"
                      onClick={() => updateStock(p.id, -1)}
                      className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-700 active:bg-stone-200"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStock(p.id, 1)}
                      className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-700 active:bg-stone-200"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStock(p.id, 10)}
                      className="px-2 py-1 rounded-lg bg-stone-100 font-bold text-[10px] text-stone-700 active:bg-stone-200"
                    >
                      +10
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="py-1.5 px-3 rounded-lg bg-stone-900 text-white font-semibold text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 text-amber-300" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Edit / Add Modal */}
      <AdminProductModal
        product={editingProduct}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
};
