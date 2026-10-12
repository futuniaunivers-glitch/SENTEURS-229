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
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-violet-850" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
              Conditions de Vente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-3.5 divide-y divide-[#F0EBE1]">
          <div className="pb-3 text-xs sm:text-sm text-stone-600 leading-relaxed bg-violet-50/70 p-4 rounded-2xl border border-violet-200/60">
            <span className="font-bold text-violet-950">Important : </span>
            Afin de vous garantir un service rapide, fiable et transparent, merci de prendre attentivement connaissance de nos règles commerciales avant toute commande.
          </div>

          {settings.salesConditions.map((cond, idx) => (
            <div key={idx} className="pt-3.5 flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-stone-100 shrink-0 mt-0.5">
                {conditionIcons[cond.icon || 'check-circle'] || (
                  <CheckCircle2 className="w-5 h-5 text-violet-800" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                  {cond.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {cond.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom footer button */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#EDE8E0]">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-full bg-violet-900 hover:bg-violet-950 text-white text-xs sm:text-sm font-semibold transition-colors min-h-[44px]"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
