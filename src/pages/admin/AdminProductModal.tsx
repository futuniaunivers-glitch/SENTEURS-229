import React, { useState, useEffect } from 'react';
import { CategoryId, Product, WholesaleTier } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AdminProductModalProps {
  product: Product | null; // null for new product
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Parfum Oud Prestige', url: '/src/assets/images/product_oud_royal_1791367693764.jpg' },
  { label: 'Huile Musc Roll-on', url: '/src/assets/images/product_huile_musc_1791367704561.jpg' },
  { label: 'Diffuseur Tiges Rotin', url: '/src/assets/images/product_diffuseur_ambre_1791367723149.jpg' },
  { label: 'Déodorant Spray', url: '/src/assets/images/product_deodorant_spray_1791367736898.jpg' },
  { label: 'Showroom & Ambiance', url: '/src/assets/images/hero_senteurs_banner_1791367676255.jpg' },
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addProduct, updateProduct, categories } = useApp();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('parfums');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [detailPrice, setDetailPrice] = useState<number>(3000);
  const [wholesaleEnabled, setWholesaleEnabled] = useState(true);
  const [minimumWholesaleQuantity, setMinimumWholesaleQuantity] = useState(3);
  const [allowRetail, setAllowRetail] = useState(true);
  const [stock, setStock] = useState<number>(20);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [isActive, setIsActive] = useState(true);
  const [wholesaleTiers, setWholesaleTiers] = useState<WholesaleTier[]>([
    { minQuantity: 3, pricePerUnit: 2700 },
    { minQuantity: 6, pricePerUnit: 2500 },
    { minQuantity: 12, pricePerUnit: 2300 },
  ]);
  const [error, setError] = useState<string | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.categoryId);
      setDescription(product.description);
      setImageUrl(product.imageUrl);
      setDetailPrice(product.detailPrice);
      setWholesaleEnabled(product.wholesaleEnabled);
      setMinimumWholesaleQuantity(product.minimumWholesaleQuantity);
      setAllowRetail(product.allowRetail);
      setStock(product.stock);
      setLowStockThreshold(product.lowStockThreshold);
      setIsActive(product.isActive);
      setWholesaleTiers(
        product.wholesaleTiers && product.wholesaleTiers.length > 0
          ? [...product.wholesaleTiers]
          : [
              { minQuantity: 3, pricePerUnit: Math.round(product.detailPrice * 0.9) },
              { minQuantity: 6, pricePerUnit: Math.round(product.detailPrice * 0.82) },
              { minQuantity: 12, pricePerUnit: Math.round(product.detailPrice * 0.75) },
            ]
      );
    } else {
      // Default reset for new product
      setName('');
      setCategoryId('parfums');
      setDescription('');
      setImageUrl(PRESET_IMAGES[0].url);
      setDetailPrice(3000);
      setWholesaleEnabled(true);
      setMinimumWholesaleQuantity(3);
      setAllowRetail(true);
      setStock(25);
      setLowStockThreshold(5);
      setIsActive(true);
      setWholesaleTiers([
        { minQuantity: 3, pricePerUnit: 2700 },
        { minQuantity: 6, pricePerUnit: 2500 },
        { minQuantity: 12, pricePerUnit: 2300 },
      ]);
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Handle tier modifications
  const handleTierChange = (
    index: number,
    field: 'minQuantity' | 'pricePerUnit',
    value: number
  ) => {
    setWholesaleTiers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: Math.max(1, value || 0) };
      return updated;
    });
  };

  const handleAddTier = () => {
    const lastTier = wholesaleTiers[wholesaleTiers.length - 1];
    const newQty = lastTier ? lastTier.minQuantity + 6 : 3;
    const newPrice = lastTier ? Math.max(100, Math.round(lastTier.pricePerUnit * 0.9)) : 2500;
    setWholesaleTiers((prev) => [...prev, { minQuantity: newQty, pricePerUnit: newPrice }]);
  };

  const handleRemoveTier = (index: number) => {
    setWholesaleTiers((prev) => prev.filter((_, i) => i !== index));
  };

  // Image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Le nom du produit est obligatoire.');
      return;
    }

    if (detailPrice <= 0) {
      setError('Le prix de détail doit être supérieur à 0.');
      return;
    }

    // Sort wholesale tiers
    const sortedTiers = [...wholesaleTiers].sort((a, b) => a.minQuantity - b.minQuantity);

    const productPayload = {
      name: name.trim(),
      categoryId,
      description: description.trim(),
      imageUrl,
      detailPrice: Math.round(detailPrice),
      wholesaleEnabled,
      minimumWholesaleQuantity: Math.max(1, minimumWholesaleQuantity),
      wholesaleTiers: sortedTiers,
      allowRetail,
      stock: Math.max(0, stock),
      lowStockThreshold: Math.max(1, lowStockThreshold),
      isActive,
    };

    if (product) {
      updateProduct(product.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
              {product ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
            </h2>
            <p className="text-[11px] text-stone-500">
              Paramétrez les prix de gros, le stock et la visibilité publique.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Informations Générales */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              1. Informations Générales
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Parfum Oud Royal Privé 100ml"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Catégorie *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Statut de Visibilité *
                </label>
                <select
                  value={isActive ? 'active' : 'inactive'}
                  onChange={(e) => setIsActive(e.target.value === 'active')}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                >
                  <option value="active">🟢 Actif (Visible au public)</option>
                  <option value="inactive">⚪ Inactif (Masqué du catalogue)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Description du produit
              </label>
              <textarea
                rows={3}
                placeholder="Notes olfactives, contenance, conseils d'utilisation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>
          </div>

          {/* Section 2: Photo du Produit */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              2. Photo du Produit
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                <img
                  src={imageUrl}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <label className="block text-xs font-semibold text-stone-700">
                  Choisir une photo depuis votre appareil ou une photo catalogue :
                </label>
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser (smartphone / PC)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`text-[10px] px-2 py-1 rounded-md border whitespace-nowrap transition-colors ${
                        imageUrl === preset.url
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Prix & Paliers de Gros */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              3. Tarification & Paliers Grossistes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Prix détail (FCFA) *
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  value={detailPrice}
                  onChange={(e) => setDetailPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Quantité minimum pour le gros *
                </label>
                <input
                  type="number"
                  min="1"
                  value={minimumWholesaleQuantity}
                  onChange={(e) => setMinimumWholesaleQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
                <span className="text-[10px] text-stone-500">
                  Par défaut 3 pièces (ou 6 pour huiles mini-format).
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wholesaleEnabled}
                  onChange={(e) => setWholesaleEnabled(e.target.checked)}
                  className="w-4 h-4 accent-stone-900 rounded"
                />
                <span className="text-xs text-stone-800 font-medium">
                  Activer la vente en gros pour ce produit
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowRetail}
                  onChange={(e) => setAllowRetail(e.target.checked)}
                  className="w-4 h-4 accent-stone-900 rounded"
                />
                <span className="text-xs text-stone-800 font-medium">
                  Autoriser la vente au détail (1–2 pièces)
                </span>
              </label>
            </div>

            {/* Wholesale Tiers Table */}
            {wholesaleEnabled && (
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      Paliers de prix dégressifs (Quantité $\to$ Prix unitaire)
                    </h4>
                    <p className="text-[10px] text-amber-800">
                      Exemple : 3 pcs $\to$ 2 700 F, 6 pcs $\to$ 2 500 F, 12 pcs $\to$ 2 300 F (douzaine)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTier}
                    className="py-1.5 px-3 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter palier</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {wholesaleTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-200 text-xs"
                    >
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-stone-500 text-[11px] whitespace-nowrap">Dès</span>
                        <input
                          type="number"
                          min="1"
                          value={tier.minQuantity}
                          onChange={(e) =>
                            handleTierChange(idx, 'minQuantity', parseInt(e.target.value, 10))
                          }
                          className="w-16 px-2 py-1 bg-stone-50 border border-stone-300 rounded font-bold text-center tabular-nums"
                        />
                        <span className="text-stone-500 text-[11px]">pièces :</span>
                      </div>

                      <div className="flex-1 flex items-center gap-1">
                        <input
                          type="number"
                          min="100"
                          step="50"
                          value={tier.pricePerUnit}
                          onChange={(e) =>
                            handleTierChange(idx, 'pricePerUnit', parseInt(e.target.value, 10))
                          }
                          className="w-24 px-2 py-1 bg-stone-50 border border-stone-300 rounded font-bold text-center tabular-nums"
                        />
                        <span className="text-stone-600 text-[11px]">FCFA/pce</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveTier(idx)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        aria-label="Supprimer ce palier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Stock & Alertes */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              4. Gestion du Stock & Seuils
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Stock disponible actuel *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Seuil d'alerte stock faible *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              ENREGISTRER LE PRODUIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
