import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import {
  Save,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building,
  Share2,
  FileText,
  Truck,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetDemoData, showToast } = useApp();

  const [formData, setFormData] = useState({
    businessName: settings.businessName,
    subtitle: settings.subtitle,
    phone: settings.phone,
    whatsappRaw: settings.whatsappRaw,
    whatsappChannel: settings.whatsappChannel,
    tiktok: settings.tiktok,
    facebook: settings.facebook,
    googleMaps: settings.googleMaps,
    deliveryInfo: settings.deliveryInfo,
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const res = StorageService.updateAdminPassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ success: true, text: 'Mot de passe modifié avec succès !' });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({
        success: false,
        text: res.message || 'Erreur lors du changement de mot de passe.',
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
          Paramètres Généraux
        </h2>
        <p className="text-xs text-stone-500">
          Mettez à jour les coordonnées commerciales, liens sociaux, conditions de vente et sécurité.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Entreprise */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Building className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif text-base font-bold text-stone-900">
              Identité de l'Entreprise
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Nom commercial
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Sous-titre / Spécialités
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Téléphone d'affichage
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Numéro WhatsApp Brut (sans espaces ni signe +)
              </label>
              <input
                type="text"
                name="whatsappRaw"
                value={formData.whatsappRaw}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Réseaux & Liens */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Share2 className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif text-base font-bold text-stone-900">
              Réseaux Sociaux & Liens Externes
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Lien Chaîne WhatsApp
              </label>
              <input
                type="url"
                name="whatsappChannel"
                value={formData.whatsappChannel}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Lien TikTok
                </label>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Lien Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Lien Google Maps (Localisation de la boutique)
              </label>
              <input
                type="url"
                name="googleMaps"
                value={formData.googleMaps}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Livraison info */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Truck className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif text-base font-bold text-stone-900">
              Informations de Livraison
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Texte informatif livraison
            </label>
            <textarea
              rows={2}
              name="deliveryInfo"
              value={formData.deliveryInfo}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>
        </div>

        <button
          type="submit"
          className="py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4 text-amber-300" />
          <span>Enregistrer les paramètres</span>
        </button>
      </form>

      {/* Section 4: Mot de passe Admin */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <KeyRound className="w-5 h-5 text-amber-800" />
          <h3 className="font-serif text-base font-bold text-stone-900">
            Sécurité — Mot de passe Propriétaire
          </h3>
        </div>

        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              passwordMsg.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {passwordMsg.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition-colors"
            >
              Mettre à jour le mot de passe
            </button>
          </div>
        </form>
      </div>

      {/* Section 5: Réinitialisation données Démo */}
      <div className="bg-amber-50/70 rounded-3xl border border-amber-200/80 p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-800" />
          <h3 className="font-serif text-base font-bold text-amber-950">
            Données de Démonstration
          </h3>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          Si vous souhaitez réinitialiser l'application avec les produits d'exemple (Parfum Oud, Huile Musc, Diffuseur, Déodorant...) et les commandes de test :
        </p>
        <button
          onClick={() => {
            if (window.confirm('Voulez-vous réinitialiser le catalogue avec les données de démonstration ?')) {
              resetDemoData();
            }
          }}
          className="py-2.5 px-4 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold transition-colors"
        >
          Réinitialiser le catalogue d'exemple
        </button>
      </div>
    </div>
  );
};
