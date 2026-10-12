import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, ExternalLink, MapPin, Phone, Lock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, settings } = useApp();

  return (
    <footer className="bg-[#EDE3D6] text-[#1F1630] pt-12 pb-24 md:pb-12 border-t border-[#E6DDD0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[12px] bg-[#5B2A86] text-white flex items-center justify-center text-sm font-extrabold shadow-soft">
                GS
              </div>
              <span className="text-base sm:text-lg font-bold text-[#1F1630] tracking-tight">
                {settings.businessName}
              </span>
            </div>
            <p className="text-xs text-[#5B2A86] font-bold">
              {settings.subtitle}
            </p>
            <p className="text-xs text-[#6B6177] leading-relaxed">
              Vente en gros, semi-gros et détail de parfums d'exception, huiles pures, déodorants et diffuseurs d'ambiance au Bénin.
            </p>
            <div className="pt-1">
              <a
                href={settings.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] bg-[#25D366]/15 hover:bg-[#25D366] text-[#2E7D4F] hover:text-white border border-[#25D366]/30 rounded-full text-xs font-bold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Rejoindre notre chaîne WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-[#1F1630] uppercase tracking-wider mb-2">
              Navigation
            </h4>
            <ul className="text-xs text-[#6B6177]">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="min-h-[44px] flex items-center hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('products')}
                  className="min-h-[44px] flex items-center hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  Catalogue des produits
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('conditions')}
                  className="min-h-[44px] flex items-center hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  Conditions générales de vente
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="min-h-[44px] flex items-center hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  Contact & informations
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-xs font-bold text-[#1F1630] uppercase tracking-wider mb-2">
              Réseaux & Communauté
            </h4>
            <ul className="text-xs text-[#6B6177]">
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex items-center gap-1.5 hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  <span>WhatsApp Officiel ({settings.phone})</span>
                  <ExternalLink className="w-3 h-3 text-[#6B6177]" />
                </a>
              </li>
              <li>
                <a
                  href={settings.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex items-center gap-1.5 hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  <span>Chaîne WhatsApp Nouveautés</span>
                  <ExternalLink className="w-3 h-3 text-[#6B6177]" />
                </a>
              </li>
              <li>
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex items-center gap-1.5 hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  <span>TikTok @grossiste.des.sen</span>
                  <ExternalLink className="w-3 h-3 text-[#6B6177]" />
                </a>
              </li>
              <li>
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex items-center gap-1.5 hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  <span>Facebook Officiel</span>
                  <ExternalLink className="w-3 h-3 text-[#6B6177]" />
                </a>
              </li>
              <li>
                <a
                  href={settings.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex items-center gap-1.5 hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#5B2A86]" />
                  <span>Localisation boutique (Google Maps)</span>
                  <ExternalLink className="w-3 h-3 text-[#6B6177]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Business & Payment Policy Reminder */}
          <div>
            <h4 className="text-xs font-bold text-[#1F1630] uppercase tracking-wider mb-2">
              Engagements de Vente
            </h4>
            <div className="bg-white/80 p-4 rounded-[12px] border border-[#E6DDD0] text-xs space-y-2 text-[#1F1630] shadow-soft">
              <p className="font-bold text-[#5B2A86]">
                Paiement Mobile Money / Moov Money exigé
              </p>
              <p className="text-[11px] text-[#6B6177] leading-relaxed">
                Pas de paiement à la livraison. Les commandes sont expédiées après réception du paiement. À la livraison, vous ne réglez que les frais de livraison.
              </p>
              <p className="text-[11px] text-[#6B6177] font-medium">
                Minimum gros : 3 pièces (6 pièces pour huiles mini-format).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#E6DDD0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6177]">
          <p>© {new Date().getFullYear()} {settings.businessName} — Tous droits réservés.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('conditions')}
              className="min-h-[44px] flex items-center hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
            >
              Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('contact')}
              className="min-h-[44px] flex items-center hover:text-[#5B2A86] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
            >
              Contact
            </button>
            <span>•</span>
            {/* Owner portal access */}
            <button
              onClick={() => setCurrentView('admin')}
              className="min-h-[44px] inline-flex items-center gap-1 hover:text-[#5B2A86] transition-colors text-[#6B6177] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86] rounded-md"
              title="Espace réservé à l'administration"
            >
              <Lock className="w-3 h-3" />
              <span>Espace Propriétaire</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
