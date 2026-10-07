import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, ExternalLink, MapPin, Phone, Lock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, settings } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-serif text-sm font-bold">
                GS
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">
                {settings.businessName}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 font-medium">
              {settings.subtitle}
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Vente en gros, semi-gros et détail de parfums d'exception, huiles pures, déodorants et diffuseurs d'ambiance au Bénin.
            </p>
            <div className="pt-1">
              <a
                href={settings.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Rejoindre notre chaîne WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('products')}
                  className="hover:text-white transition-colors"
                >
                  Catalogue des produits
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('conditions')}
                  className="hover:text-white transition-colors"
                >
                  Conditions générales de vente
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & informations
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Réseaux & Communauté
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>WhatsApp Officiel ({settings.phone})</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href={settings.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Chaîne WhatsApp Nouveautés</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>TikTok @grossiste.des.sen</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Facebook Officiel</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href={settings.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Localisation boutique (Google Maps)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Business & Payment Policy Reminder */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Engagements de Vente
            </h4>
            <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60 text-xs space-y-2 text-stone-300">
              <p className="font-semibold text-amber-200">
                Paiement Mobile Money / Moov Money exigé
              </p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Pas de paiement à la livraison. Les commandes sont expédiées après réception du paiement. À la livraison, vous ne réglez que les frais de livraison.
              </p>
              <p className="text-[11px] text-stone-400">
                Minimum gros : 3 pièces (6 pièces pour huiles mini-format).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.businessName} — Tous droits réservés.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('conditions')}
              className="hover:text-stone-300 transition-colors"
            >
              Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('contact')}
              className="hover:text-stone-300 transition-colors"
            >
              Contact
            </button>
            <span>•</span>
            {/* Owner portal access */}
            <button
              onClick={() => setCurrentView('admin')}
              className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors text-stone-500 font-medium"
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
