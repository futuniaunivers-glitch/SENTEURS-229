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
      className="fixed inset-0 z-50 overflow-y-auto bg-[#1F1630]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-t-[20px] sm:rounded-[20px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#E6DDD0]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#5B2A86]" />
            <h2 className="text-base sm:text-lg font-bold text-[#1F1630]">
              Conditions de Vente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-[#6B6177] hover:text-[#1F1630] hover:bg-[#EFE7F7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-3.5 divide-y divide-[#E6DDD0]">
          <div className="pb-3 text-xs sm:text-sm text-[#5B2A86] leading-relaxed bg-[#EFE7F7] p-3.5 rounded-[12px] border border-[#5B2A86]/15">
            <span className="font-bold">Important : </span>
            Afin de vous garantir un service rapide, fiable et transparent, merci de prendre attentivement connaissance de nos règles commerciales avant toute commande.
          </div>

          {settings.salesConditions.map((cond, idx) => (
            <div key={idx} className="pt-3.5 flex items-start gap-3.5">
              <div className="p-2.5 rounded-[12px] bg-[#EFE7F7] text-[#5B2A86] shrink-0 mt-0.5">
                {conditionIcons[cond.icon || 'check-circle'] || (
                  <CheckCircle2 className="w-5 h-5 text-[#5B2A86]" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-[#1F1630]">
                  {cond.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6177] leading-relaxed">
                  {cond.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom footer button */}
        <div className="p-4 bg-[#F8F3EC] border-t border-[#E6DDD0]">
          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-3 px-6 rounded-full bg-[#5B2A86] hover:bg-[#4A2070] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all duration-200 ease-out shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
