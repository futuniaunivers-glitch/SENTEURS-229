import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Save,
  RotateCcw,
  Building,
  Share2,
  Truck,
  Cloud,
  UserCheck,
  Copy,
  Check,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetDemoData,
    isFirebaseActive,
    currentUser,
    changeAdminPassword,
  } = useApp();

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

  const [copiedUid, setCopiedUid] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    setFormData({
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
  }, [settings]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  const handleCopyUid = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPwdLoading(true);
    setPasswordMsg(null);
    const res = await changeAdminPassword(currentPassword, newPassword);
    setPwdLoading(false);
    if (res.success) {
      setPasswordMsg({
        success: true,
        text: 'Mot de passe modifié avec succès sur Firebase Authentication ! Il est désormais actif sur tous vos appareils.',
      });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({
        success: false,
        text: res.error || 'Erreur lors du changement de mot de passe.',
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
          Mettez à jour les coordonnées commerciales, liens sociaux, livraison et informations Firebase.
        </p>
      </div>

      {/* Firebase & Admin Session Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif text-base font-bold text-stone-900">
              État de la Connexion Cloud & Session Administrateur
            </h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isFirebaseActive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {isFirebaseActive ? 'Firestore En Ligne' : 'Mode Démo Local'}
          </span>
        </div>

        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-stone-900">
              Compte administrateur actif :
            </span>
            <span className="text-stone-700">{currentUser?.email || 'Session locale active'}</span>
          </div>

          {currentUser?.uid && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
              <span className="text-stone-500 text-[11px]">
                UID Firebase (document dans la collection <code>admins</code>) :
              </span>
              <div className="flex items-center gap-1.5">
                <code className="bg-white px-2 py-0.5 rounded border text-[11px] font-mono text-stone-800">
                  {currentUser.uid}
                </code>
                <button
                  type="button"
                  onClick={handleCopyUid}
                  className="p-1 text-stone-500 hover:text-stone-900 rounded"
                  title="Copier l'UID"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
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
          <span>Enregistrer les paramètres dans Firestore</span>
        </button>
      </form>

      {/* Section 4: Changement de Mot de Passe Firebase */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <KeyRound className="w-5 h-5 text-amber-800" />
          <h3 className="font-serif text-base font-bold text-stone-900">
            Modifier le Mot de Passe Administrateur
          </h3>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          Modifiez le mot de passe de votre compte Firebase. Le nouveau mot de passe sera immédiatement effectif et synchronisé sur tous vos appareils.
        </p>

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
              placeholder="Votre mot de passe actuel..."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Nouveau mot de passe (6 caractères min)..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pwdLoading}
              className="py-2.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-xs"
            >
              {pwdLoading ? 'Mise à jour en cours...' : 'Mettre à jour le mot de passe sur tous les appareils'}
            </button>
          </div>
        </form>
      </div>

      {/* Section 5: Initialisation du Catalogue */}
      <div className="bg-amber-50/70 rounded-3xl border border-amber-200/80 p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-800" />
          <h3 className="font-serif text-base font-bold text-amber-950">
            Initialisation du Catalogue
          </h3>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          {isFirebaseActive
            ? "Si votre base Firestore est nouvelle, vous pouvez injecter les articles de démonstration (Parfum Oud, Huiles Musc, Diffuseur, Déodorant...) directement dans Firestore."
            : "Réinitialise le catalogue de démonstration local."}
        </p>
        <button
          onClick={async () => {
            if (window.confirm('Voulez-vous synchroniser les données de démonstration avec Firestore ?')) {
              await resetDemoData();
            }
          }}
          className="py-2.5 px-4 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold transition-colors"
        >
          Initialiser les articles de base
        </button>
      </div>
    </div>
  );
};
