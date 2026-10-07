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
  Loader2,
} from 'lucide-react';
import { compressImage, getDataUrlSizeInKB } from '../../utils/imageCompressor';

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
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSizeKB, setImageSizeKB] = useState<number | null>(null);

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
      if (product.imageUrl && product.imageUrl.startsWith('data:image/')) {
        setImageSizeKB(getDataUrlSizeInKB(product.imageUrl));
      } else {
        setImageSizeKB(null);
      }
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
      setImageSizeKB(null);
    }
    setError(null);
    setIsCompressing(false);
    setIsSubmitting(false);
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

  // Image file upload with client-side compression (max 800px width, JPEG ~0.7, < 300 KB target)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setError(null);

    try {
      // Automatically compress in browser
      const result = await compressImage(file, 800, 0.7);

      if (result.isOverLimit) {
        setError(
          `Cette photo reste trop lourde (${result.sizeInKB} Ko après réduction, maximum autorisé 700 Ko). Veuillez choisir une photo plus petite ou moins volumineuse.`
        );
        setImageSizeKB(result.sizeInKB);
        return;
      }

      setImageUrl(result.dataUrl);
      setImageSizeKB(result.sizeInKB);
    } catch (err: any) {
      console.error('Erreur compression image:', err);
      setError("Impossible de traiter cette image. Veuillez sélectionner un autre fichier ou format.");
    } finally {
      setIsCompressing(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom du produit est obligatoire.');
      return;
    }

    if (detailPrice <= 0) {
      setError('Le prix de détail doit être supérieur à 0.');
      return;
    }

    // Verify image size if base64 data URL
    let finalImageUrl = imageUrl;
    if (finalImageUrl.startsWith('data:image/')) {
      const currentSizeKB = getDataUrlSizeInKB(finalImageUrl);
      if (currentSizeKB > 700) {
        setError(
          `Cette photo reste trop lourde (${currentSizeKB} Ko, supérieur au seuil maximal de 700 Ko). Le produit ne peut pas être enregistré. Veuillez choisir une photo plus petite.`
        );
        return;
      }
    }

    // Sort wholesale tiers
    const sortedTiers = [...wholesaleTiers].sort((a, b) => a.minQuantity - b.minQuantity);

    const productPayload = {
      name: name.trim(),
      categoryId,
      description: description.trim(),
      imageUrl: finalImageUrl,
      detailPrice: Math.round(detailPrice),
      wholesaleEnabled,
      minimumWholesaleQuantity: Math.max(1, minimumWholesaleQuantity),
      wholesaleTiers: sortedTiers,
      allowRetail,
      stock: Math.max(0, stock),
      lowStockThreshold: Math.max(1, lowStockThreshold),
      isActive,
    };

    setIsSubmitting(true);
    try {
      if (product) {
        await updateProduct(product.id, productPayload);
      } else {
        await addProduct(productPayload);
      }
      onClose();
    } catch (err: any) {
      console.error('Erreur enregistrement Firestore:', err);
      const errorMsg = err?.message || String(err);
      setError(
        `Échec de l'enregistrement dans Firestore : ${errorMsg}. Le produit n'a pas été enregistré.`
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="font-medium leading-relaxed">{error}</div>
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

          {/* Section 2: Photo du Produit avec Réduction Automatique */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                2. Photo du Produit
              </h3>
              <span className="text-[11px] text-stone-500">
                Optimisation auto (max 800px · JPEG · &lt; 300 Ko)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                <img
                  src={imageUrl}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
                {isCompressing && (
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <label className="block text-xs font-semibold text-stone-700">
                  Sélectionner une photo depuis votre appareil ou une photo catalogue :
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                    {isCompressing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{isCompressing ? 'Réduction en cours...' : 'Téléverser une photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressing || isSubmitting}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {imageSizeKB !== null && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                        imageSizeKB <= 300
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : imageSizeKB <= 700
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      Taille : {imageSizeKB} Ko {imageSizeKB <= 300 ? '(idéale)' : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.url);
                        setImageSizeKB(null);
                        setError(null);
                      }}
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
              disabled={isSubmitting}
              className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="py-2.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-amber-300" />}
              <span>{isSubmitting ? 'Enregistrement en cours...' : 'ENREGISTRER LE PRODUIT'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
