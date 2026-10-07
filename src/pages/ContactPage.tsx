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
        <span className="text-xs uppercase tracking-wider text-amber-900 font-bold">
          Réseaux & Disponibilité
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Contact & Accès Boutique
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Retrouvez tous les canaux officiels de GROSSISTE DES SENTEURS 229 pour nous écrire, passer vos commandes ou nous rendre visite.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp & Phone */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900">
              WhatsApp & Ligne Directe
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Pour vos questions sur les stocks, devis sur-mesure et réceptions de commandes.
            </p>
          </div>
          <div className="text-xl font-bold font-serif text-stone-950">
            {settings.phone}
          </div>
          <div className="pt-1 flex flex-col gap-2">
            <a
              href={`https://wa.me/${settings.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ouvrir discussion WhatsApp</span>
            </a>
            <a
              href={settings.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-emerald-200"
            >
              <span>Suivre notre chaîne WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Physical Location */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Localisation & Retrait
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Consultez notre position sur Google Maps pour planifier votre itinéraire ou votre retrait sur place.
            </p>
          </div>
          <div className="text-xs text-stone-700 space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <p className="font-semibold text-stone-900">Bénin</p>
            <p className="text-stone-500 text-[11px]">
              Expédition journalière sur Cotonou, Calavi, Porto-Novo et par bus/transporteurs dans tout le Bénin.
            </p>
          </div>
          <div className="pt-1">
            <a
              href={settings.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Ouvrir sur Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-800" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Nos Réseaux Sociaux Officiels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={settings.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-950 text-white flex items-center justify-center font-bold text-sm">
                  TT
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-900">
                    TikTok @grossiste.des.sen
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Vidéos de déballage, présentations des fragrances et arrivages.
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-stone-900 shrink-0" />
            </a>

            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border border-stone-200 hover:border-blue-600 hover:bg-blue-50/30 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
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
