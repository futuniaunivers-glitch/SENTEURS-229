import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Ban,
  CheckCircle2,
  Truck,
  Package,
  Droplets,
  AlertTriangle,
  Heart,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export const ConditionsPage: React.FC = () => {
  const { settings, setCurrentView } = useApp();

  const conditionIcons: Record<string, React.ReactNode> = {
    'credit-card': <CreditCard className="w-6 h-6 text-amber-700" />,
    ban: <Ban className="w-6 h-6 text-rose-600" />,
    'check-circle': <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    truck: <Truck className="w-6 h-6 text-blue-600" />,
    package: <Package className="w-6 h-6 text-purple-600" />,
    droplets: <Droplets className="w-6 h-6 text-cyan-600" />,
    'alert-triangle': <AlertTriangle className="w-6 h-6 text-amber-600" />,
    heart: <Heart className="w-6 h-6 text-rose-500" />,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Title */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-100 text-violet-950 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-800" />
          <span>Charte Commerciale</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          CONDITIONS DE VENTE
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Pour préserver la qualité de nos services et la rapidité de nos livraisons, veuillez lire attentivement nos conditions de vente officielles ci-dessous.
        </p>
      </div>

      {/* Conditions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.salesConditions.map((cond, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white border border-[#EDE8E0] shadow-xs flex items-start gap-4 hover:border-violet-300 transition-colors"
          >
            <div className="p-3 rounded-2xl bg-stone-100 shrink-0">
              {conditionIcons[cond.icon || 'check-circle'] || (
                <CheckCircle2 className="w-6 h-6 text-violet-800" />
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-stone-900">
                {cond.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {cond.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="bg-[#2D0A4E] text-stone-200 rounded-3xl p-6 sm:p-8 space-y-4 border border-violet-900/50 shadow-lg">
        <h2 className="text-xl font-extrabold text-white">
          En résumé avant de passer commande :
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-violet-950/70 p-4 rounded-2xl border border-violet-900/60">
            <p className="font-bold text-amber-300 mb-1">1. Sélectionnez vos articles</p>
            <p className="text-stone-300 leading-relaxed">
              Respectez le minimum de 3 pièces pour le gros (6 pour les huiles mini-format).
            </p>
          </div>
          <div className="bg-violet-950/70 p-4 rounded-2xl border border-violet-900/60">
            <p className="font-bold text-amber-300 mb-1">2. Envoyez sur WhatsApp</p>
            <p className="text-stone-300 leading-relaxed">
              Renseignez vos coordonnées de livraison et validez votre panier.
            </p>
          </div>
          <div className="bg-violet-950/70 p-4 rounded-2xl border border-violet-900/60">
            <p className="font-bold text-amber-300 mb-1">3. Réglez par Mobile Money</p>
            <p className="text-stone-300 leading-relaxed">
              Votre commande est validée après encaissement. Frais de livraison payés au livreur.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentView('products')}
            className="py-3.5 px-6 rounded-full bg-amber-300 hover:bg-amber-200 text-violet-950 font-bold text-xs sm:text-sm transition-colors shadow-sm min-h-[44px]"
          >
            Passer à la commande
          </button>
          <a
            href={`https://wa.me/${settings.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors border border-white/20 flex items-center gap-2 min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Contacter un conseiller WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
