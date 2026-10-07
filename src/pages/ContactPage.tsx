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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Title */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider text-violet-900 font-bold">
          Réseaux & Disponibilité
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Contact & Accès Boutique
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Retrouvez tous les canaux officiels de GROSSISTE DES SENTEURS 229 pour nous écrire, passer vos commandes ou nous rendre visite.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp & Phone */}
        <div className="bg-white rounded-3xl border border-[#EDE8E0] p-6 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              WhatsApp & Ligne Directe
            </h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Pour vos questions sur les stocks, devis sur-mesure et réceptions de commandes.
            </p>
          </div>
          <div className="text-xl font-extrabold text-violet-950">
            {settings.phone}
          </div>
          <div className="pt-1 flex flex-col gap-2.5">
            <a
              href={`https://wa.me/${settings.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ouvrir discussion WhatsApp</span>
            </a>
            <a
              href={settings.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-emerald-200 min-h-[44px]"
            >
              <span>Suivre notre chaîne WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Physical Location */}
        <div className="bg-white rounded-3xl border border-[#EDE8E0] p-6 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-900 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Localisation & Retrait
            </h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Consultez notre position sur Google Maps pour planifier votre itinéraire ou votre retrait sur place.
            </p>
          </div>
          <div className="text-xs text-stone-700 space-y-1 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE8E0]">
            <p className="font-bold text-stone-900">Bénin</p>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Expédition journalière sur Cotonou, Calavi, Porto-Novo et par bus/transporteurs dans tout le Bénin.
            </p>
          </div>
          <div className="pt-1">
            <a
              href={settings.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-5 rounded-full bg-violet-900 hover:bg-violet-950 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs min-h-[44px]"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Ouvrir sur Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-violet-300" />
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#EDE8E0] p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-900 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Nos Réseaux Sociaux Officiels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={settings.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border border-[#EDE8E0] hover:border-violet-400 hover:bg-violet-50/40 flex items-center justify-between transition-all group min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center font-bold text-sm">
                  TT
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-violet-900">
                    TikTok @grossiste.des.sen
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Vidéos de déballage, présentations des fragrances et arrivages.
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-violet-900 shrink-0" />
            </a>

            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border border-[#EDE8E0] hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-between transition-all group min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  FB
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-blue-700">
                    Page Facebook Officielle
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Retrouvez nos publications régulières et avis clients.
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-blue-600 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
