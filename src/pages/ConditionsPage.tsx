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
    'credit-card': <CreditCard className="w-6 h-6 text-[#5B2A86]" />,
    ban: <Ban className="w-6 h-6 text-[#B3261E]" />,
    'check-circle': <CheckCircle2 className="w-6 h-6 text-[#2E7D4F]" />,
    truck: <Truck className="w-6 h-6 text-[#5B2A86]" />,
    package: <Package className="w-6 h-6 text-[#5B2A86]" />,
    droplets: <Droplets className="w-6 h-6 text-[#5B2A86]" />,
    'alert-triangle': <AlertTriangle className="w-6 h-6 text-[#B7791F]" />,
    heart: <Heart className="w-6 h-6 text-[#5B2A86]" />,
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Title */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFE7F7] text-[#5B2A86] text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Charte Commerciale</span>
        </div>
        <h1 className="text-section-title text-[#1F1630]">
          CONDITIONS DE VENTE
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6177] leading-relaxed">
          Pour préserver la qualité de nos services et la rapidité de nos livraisons, veuillez lire attentivement nos conditions de vente officielles ci-dessous.
        </p>
      </div>

      {/* Conditions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.salesConditions.map((cond, idx) => (
          <div
            key={idx}
            className="p-5 rounded-[20px] bg-white border border-[#E6DDD0] shadow-soft flex items-start gap-4 hover:border-[#5B2A86] transition-colors"
          >
            <div className="p-2.5 rounded-[12px] bg-[#EFE7F7] text-[#5B2A86] shrink-0">
              {conditionIcons[cond.icon || 'check-circle'] || (
                <CheckCircle2 className="w-6 h-6 text-[#5B2A86]" />
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[#1F1630]">
                {cond.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6177] leading-relaxed font-normal">
                {cond.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="bg-[#EDE3D6] text-[#1F1630] rounded-[20px] p-6 sm:p-8 space-y-5 border border-[#E6DDD0] shadow-soft">
        <h2 className="text-lg sm:text-xl font-bold text-[#1F1630]">
          En résumé avant de passer commande :
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/80 p-4 rounded-[12px] border border-[#E6DDD0]">
            <p className="font-bold text-[#5B2A86] mb-1">1. Sélectionnez vos articles</p>
            <p className="text-[#6B6177]">
              Respectez le minimum de 3 pièces pour le gros (6 pour les huiles mini-format).
            </p>
          </div>
          <div className="bg-white/80 p-4 rounded-[12px] border border-[#E6DDD0]">
            <p className="font-bold text-[#5B2A86] mb-1">2. Envoyez sur WhatsApp</p>
            <p className="text-[#6B6177]">
              Renseignez vos coordonnées de livraison et validez votre panier.
            </p>
          </div>
          <div className="bg-white/80 p-4 rounded-[12px] border border-[#E6DDD0]">
            <p className="font-bold text-[#5B2A86] mb-1">3. Réglez par Mobile Money</p>
            <p className="text-[#6B6177]">
              Votre commande est validée après encaissement. Frais de livraison payés au livreur.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentView('products')}
            className="min-h-[44px] py-2.5 px-6 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all duration-200 ease-out shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
          >
            Passer à la commande
          </button>
          <a
            href={`https://wa.me/${settings.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] py-2.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all duration-200 ease-out flex items-center gap-1.5 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Contacter un conseiller WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
