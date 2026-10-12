import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  MessageCircle,
  MapPin,
  ExternalLink,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Title */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider text-[#5B2A86] font-bold">
          Réseaux & Disponibilité
        </span>
        <h1 className="text-section-title text-[#1F1630]">
          Contact & Accès Boutique
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6177] leading-relaxed">
          Retrouvez tous les canaux officiels de GROSSISTE DES SENTEURS 229 pour nous écrire, passer vos commandes ou nous rendre visite.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp & Phone */}
        <div className="bg-white rounded-[20px] border border-[#E6DDD0] p-6 space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-[12px] bg-[#25D366]/15 text-[#2E7D4F] flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F1630]">
              WhatsApp & Ligne Directe
            </h2>
            <p className="text-xs text-[#6B6177] mt-1">
              Pour vos questions sur les stocks, devis sur-mesure et réceptions de commandes.
            </p>
          </div>
          <div className="text-xl font-bold text-[#1F1630]">
            {settings.phone}
          </div>
          <div className="pt-1 flex flex-col gap-2">
            <a
              href={`https://wa.me/${settings.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ease-out shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ouvrir discussion WhatsApp</span>
            </a>
            <a
              href={settings.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] py-2.5 px-4 rounded-full bg-[#EFE7F7] hover:bg-[#5B2A86] text-[#5B2A86] hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200 ease-out border border-[#5B2A86]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            >
              <span>Suivre notre chaîne WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Physical Location */}
        <div className="bg-white rounded-[20px] border border-[#E6DDD0] p-6 space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-[12px] bg-[#EFE7F7] text-[#5B2A86] flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F1630]">
              Localisation & Retrait
            </h2>
            <p className="text-xs text-[#6B6177] mt-1">
              Consultez notre position sur Google Maps pour planifier votre itinéraire ou votre retrait sur place.
            </p>
          </div>
          <div className="text-xs text-[#1F1630] space-y-1 bg-[#F8F3EC] p-3 rounded-[12px] border border-[#E6DDD0]">
            <p className="font-bold text-[#1F1630]">Bénin</p>
            <p className="text-[#6B6177] text-[11px]">
              Expédition journalière sur Cotonou, Calavi, Porto-Novo et par bus/transporteurs dans tout le Bénin.
            </p>
          </div>
          <div className="pt-1">
            <a
              href={settings.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] py-3 px-4 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ease-out shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            >
              <MapPin className="w-4 h-4 text-[#EFE7F7]" />
              <span>Ouvrir sur Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/70" />
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div className="md:col-span-2 bg-white rounded-[20px] border border-[#E6DDD0] p-6 sm:p-8 space-y-5 shadow-soft">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#5B2A86]" />
            <h2 className="text-lg font-bold text-[#1F1630]">
              Nos Réseaux Sociaux Officiels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={settings.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-[12px] border border-[#E6DDD0] hover:border-[#5B2A86] hover:bg-[#EFE7F7]/30 flex items-center justify-between transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#1F1630] text-white flex items-center justify-center font-bold text-sm">
                  TT
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1F1630] group-hover:text-[#5B2A86] transition-colors">
                    TikTok @grossiste.des.sen
                  </h3>
                  <p className="text-[11px] text-[#6B6177]">
                    Vidéos de déballage, présentations des fragrances et arrivages.
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6B6177] group-hover:text-[#5B2A86] shrink-0 transition-colors" />
            </a>

            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-[12px] border border-[#E6DDD0] hover:border-[#5B2A86] hover:bg-[#EFE7F7]/30 flex items-center justify-between transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  FB
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1F1630] group-hover:text-[#5B2A86] transition-colors">
                    Page Facebook Officielle
                  </h3>
                  <p className="text-[11px] text-[#6B6177]">
                    Retrouvez nos publications régulières et avis clients.
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6B6177] group-hover:text-[#5B2A86] shrink-0 transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
