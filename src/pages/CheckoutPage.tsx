import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatFCFA } from '../utils/pricing';
import { buildWhatsAppUrl, generateWhatsAppOrderMessage } from '../utils/whatsapp';
import {
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Truck,
  FileText,
} from 'lucide-react';
import { CustomerDetails, Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    setCurrentView,
    createOrder,
    clearCart,
    settings,
    setIsConditionsModalOpen,
  } = useApp();

  const [form, setForm] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    city: 'Cotonou',
    area: '',
    deliveryNote: '',
    notes: '',
    acceptedTerms: false,
  });

  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // If cart is empty and no order just submitted
  if (cart.length === 0 && !submittedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-900 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">
          Votre panier est vide
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Vous devez sélectionner au moins un article avant de pouvoir finaliser votre commande.
        </p>
        <button
          onClick={() => setCurrentView('products')}
          className="mt-2 py-3 px-6 rounded-full bg-violet-900 text-white text-xs font-semibold hover:bg-violet-950 transition-colors min-h-[44px]"
        >
          Découvrir nos produits
        </button>
      </div>
    );
  }

  // Success view after sending on WhatsApp
  if (submittedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-3xl border border-[#EDE8E0] p-6 sm:p-8 text-center space-y-5 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-violet-900 uppercase tracking-wider">
              Commande enregistrée
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Commande {submittedOrder.orderNumber}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Merci pour votre commande, <strong>{submittedOrder.customerName}</strong> !
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#EDE8E0] text-left space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-stone-900 border-b border-[#EBE4D8] pb-2">
              <span>Total à régler :</span>
              <span className="text-base text-violet-950 font-extrabold tabular-nums">
                {formatFCFA(submittedOrder.total)}
              </span>
            </div>
            <p className="text-stone-700">
              <strong>Rappel de la règle de vente :</strong> La commande est confirmée dès réception de votre paiement Mobile Money ou Moov Money.
            </p>
            <p className="text-stone-500 text-[11px]">
              À la livraison, vous ne payez que les frais de livraison directement au livreur.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href={buildWhatsAppUrl(
                settings.whatsappRaw,
                generateWhatsAppOrderMessage(
                  submittedOrder.items.map((i) => ({
                    product: { id: i.productId, name: i.productName } as any,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    subtotal: i.subtotal,
                  })),
                  form,
                  submittedOrder.total
                )
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[48px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ouvrir WhatsApp à nouveau si besoin</span>
            </a>

            <button
              onClick={() => {
                setSubmittedOrder(null);
                setCurrentView('products');
              }}
              className="w-full py-3 px-5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors min-h-[44px]"
            >
              Retourner au catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setFormError(null);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!form.fullName.trim()) {
      setFormError('Veuillez renseigner votre nom complet.');
      return;
    }

    if (!form.phone.trim()) {
      setFormError('Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    if (!form.city.trim()) {
      setFormError('Veuillez renseigner la ville.');
      return;
    }

    if (!form.area.trim()) {
      setFormError('Veuillez indiquer votre quartier ou zone.');
      return;
    }

    if (!form.deliveryNote.trim()) {
      setFormError('Veuillez donner une indication de livraison (carrefour, repère).');
      return;
    }

    if (!form.acceptedTerms) {
      setFormError('Vous devez cocher la case d’acceptation des conditions de vente pour valider.');
      return;
    }

    // 1. Create order in persistent DB (Firestore or Local demo)
    const created = await createOrder({
      customerName: form.fullName,
      phone: form.phone,
      city: form.city,
      area: form.area,
      deliveryNote: form.deliveryNote,
      notes: form.notes,
      items: cart,
    });

    // 2. Generate WhatsApp message and URL
    const message = generateWhatsAppOrderMessage(cart, form, cartTotal);
    const whatsappUrl = buildWhatsAppUrl(settings.whatsappRaw, message);

    // 3. Clear cart and set submitted state
    clearCart();
    setSubmittedOrder(created);

    // 4. Open WhatsApp immediately
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top back button */}
      <button
        onClick={() => setCurrentView('products')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-violet-950 transition-colors py-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour au catalogue</span>
      </button>

      {/* Page Title */}
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-wider text-violet-900 font-bold">
          Étape Finale
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Validation de votre Commande
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Renseignez vos coordonnées de livraison pour transmettre instantanément votre commande sur notre WhatsApp officiel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EDE8E0] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-900 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Informations de Livraison
            </h2>
          </div>

          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Ex : Amina Houessou"
                value={form.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8E0] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-violet-900/15 focus:border-violet-900 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Numéro de Téléphone (Appels & WhatsApp) *
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Ex : +229 97 00 00 00"
                value={form.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8E0] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-violet-900/15 focus:border-violet-900 min-h-[44px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Ville *
                </label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8E0] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-violet-900/15 focus:border-violet-900 min-h-[44px]"
                >
                  <option value="Cotonou">Cotonou</option>
                  <option value="Abomey-Calavi">Abomey-Calavi</option>
                  <option value="Porto-Novo">Porto-Novo</option>
                  <option value="Ouidah">Ouidah</option>
                  <option value="Parakou">Parakou</option>
                  <option value="Bohicon">Bohicon</option>
                  <option value="Autre ville">Autre ville du Bénin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Quartier / Zone *
                </label>
                <input
                  type="text"
                  name="area"
                  required
                  placeholder="Ex : Fidjrossè, Agla, Kpota..."
                  value={form.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8E0] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-violet-900/15 focus:border-violet-900 min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Indication de livraison (repère, carrefour) *
              </label>
              <input
                type="text"
                name="deliveryNote"
                required
                placeholder="Ex : Derrière la pharmacie, portail noir face au kiosque..."
                value={form.deliveryNote}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8E0] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-violet-900/15 focus:border-violet-900 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Note facultative
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="Précision sur les heures de livraison, parfums préférés..."
                value={form.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE8E0] rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-violet-900/15 focus:border-violet-900"
              />
            </div>

            {/* Sales conditions reminder banner */}
            <div className="bg-violet-50/80 rounded-2xl p-4 border border-violet-200/70 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-violet-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-violet-800" />
                  Conditions de vente indispensables :
                </span>
                <button
                  type="button"
                  onClick={() => setIsConditionsModalOpen(true)}
                  className="text-[11px] underline text-violet-900 font-bold hover:text-violet-950"
                >
                  Lire toutes les conditions
                </button>
              </div>
              <ul className="text-violet-900 text-[11px] space-y-1 list-disc list-inside">
                <li>Paiement préalable Mobile Money / Moov Money exigé.</li>
                <li>Pas de paiement à la livraison (seuls les frais de livraison sont réglés au livreur).</li>
                <li>Minimum gros : 3 pièces (6 pièces pour huiles mini-format).</li>
              </ul>
            </div>

            {/* Mandatory Checkbox (touch-friendly min 44px container) */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-xl hover:bg-stone-50 transition-colors min-h-[44px]">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={form.acceptedTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 w-5 h-5 text-violet-900 border-stone-300 rounded focus:ring-violet-900 accent-violet-900"
                />
                <span className="text-xs text-stone-700 leading-relaxed font-medium group-hover:text-stone-900">
                  ☑ <strong>J'ai lu et compris les conditions de vente</strong> (Paiement préalable Mobile Money/Moov Money requis, frais de livraison à la réception).
                </span>
              </label>
            </div>

            {/* Submit Button (Pill button) */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!form.acceptedTerms}
                className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md min-h-[50px]"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>💬 ENVOYER MA COMMANDE SUR WHATSAPP</span>
              </button>
              {!form.acceptedTerms && (
                <p className="text-[11px] text-center text-stone-500 mt-2">
                  Veuillez accepter les conditions de vente ci-dessus pour activer le bouton de commande.
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-[#1A0A2A] text-stone-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 border border-violet-950/50">
          <div className="flex items-center justify-between border-b border-violet-900/60 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">
              Récapitulatif Panier
            </h2>
            <span className="text-xs text-stone-400">
              {cart.length} référence{cart.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-violet-950/60">
            {cart.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {item.quantity} × {formatFCFA(item.unitPrice)}
                  </p>
                </div>
                <div className="font-bold text-amber-200 tabular-nums">
                  {formatFCFA(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-violet-900/60 pt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">
                Total Produits
              </span>
              <span className="text-2xl font-extrabold text-white tabular-nums">
                {formatFCFA(cartTotal)}
              </span>
            </div>

            <p className="text-[11px] text-amber-200/90 bg-violet-950/80 p-3 rounded-2xl border border-violet-900/60 leading-relaxed">
              🚚 Frais de livraison : calculés selon votre zone (Cotonou, Calavi, etc.) et réglés directement au livreur à la réception.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
