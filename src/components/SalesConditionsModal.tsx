import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CreditCard,
  Ban,
  CheckCircle2,
  Truck,
  Package,
  Droplets,
  AlertTriangle,
  Heart,
  ShieldCheck,
} from 'lucide-react';

interface SalesConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalesConditionsModal: React.FC<SalesConditionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings } = useApp();

  if (!isOpen) return null;

  const conditionIcons: Record<string, React.ReactNode> = {
    'credit-card': <CreditCard className="w-5 h-5 text-amber-700" />,
    ban: <Ban className="w-5 h-5 text-rose-600" />,
    'check-circle': <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    truck: <Truck className="w-5 h-5 text-blue-600" />,
    package: <Package className="w-5 h-5 text-purple-600" />,
    droplets: <Droplets className="w-5 h-5 text-cyan-600" />,
    'alert-triangle': <AlertTriangle className="w-5 h-5 text-amber-600" />,
    heart: <Heart className="w-5 h-5 text-rose-500" />,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
              Conditions de Vente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-3.5 divide-y divide-stone-100">
          <div className="pb-3 text-xs sm:text-sm text-stone-600 leading-relaxed bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60">
            <span className="font-semibold text-amber-950">Important : </span>
            Afin de vous garantir un service rapide, fiable et transparent, merci de prendre attentivement connaissance de nos règles commerciales avant toute commande.
          </div>

          {settings.salesConditions.map((cond, idx) => (
            <div key={idx} className="pt-3.5 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-stone-100 shrink-0 mt-0.5">
                {conditionIcons[cond.icon || 'check-circle'] || (
                  <CheckCircle2 className="w-5 h-5 text-amber-700" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                  {cond.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {cond.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom footer button */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
