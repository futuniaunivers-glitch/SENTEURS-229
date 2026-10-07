import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatFCFA } from '../../utils/pricing';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  X,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses: OrderStatus[] = [
    'Nouvelle',
    'Confirmée',
    'En préparation',
    'Livrée',
    'Annulée',
  ];

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'all') return true;
    return ord.status === statusFilter;
  });

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Nouvelle':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmée':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'En préparation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Livrée':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'Annulée':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            Gestion des Commandes ({orders.length})
          </h2>
          <p className="text-xs text-stone-500">
            Suivi des validations Mobile Money, statuts de livraison et contact client.
          </p>
        </div>

        {/* Filter by status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Toutes ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="font-serif text-base font-bold text-stone-800">
              Aucune commande dans cette section
            </p>
            <p className="text-xs text-stone-500">
              Les nouvelles commandes passées par les clients apparaîtront automatiquement ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredOrders.map((ord) => {
              const cleanPhone = ord.phone.replace(/[^0-9]/g, '');
              return (
                <div key={ord.id} className="p-4 sm:p-5 hover:bg-stone-50/50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-serif text-base font-bold text-stone-900">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-500 font-medium">Statut :</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeClass(
                          ord.status
                        )}`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Customer and Summary row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50/80 p-3 rounded-2xl border border-stone-100">
                    <div>
                      <p className="font-bold text-stone-900">{ord.customerName}</p>
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold mt-0.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{ord.phone}</span>
                      </a>
                    </div>

                    <div>
                      <p className="text-stone-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{ord.city} — {ord.area}</span>
                      </p>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        Repère : {ord.deliveryNote}
                      </p>
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <span className="text-[11px] text-stone-500">Montant total</span>
                      <span className="font-serif text-base font-bold text-stone-950 tabular-nums">
                        {formatFCFA(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <div className="truncate max-w-md">
                      <span className="font-medium text-stone-800">Articles : </span>
                      {ord.items.map((i) => `${i.productName} (×${i.quantity})`).join(', ')}
                    </div>

                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="text-stone-700 hover:text-stone-950 font-semibold flex items-center gap-1 shrink-0 ml-2"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Détails</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Détail de la commande {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-stone-500">
                  Reçue le {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-1.5">
              <p><strong>Client :</strong> {selectedOrder.customerName}</p>
              <p><strong>Téléphone :</strong> {selectedOrder.phone}</p>
              <p><strong>Ville & Quartier :</strong> {selectedOrder.city}, {selectedOrder.area}</p>
              <p><strong>Indication de livraison :</strong> {selectedOrder.deliveryNote}</p>
              {selectedOrder.notes && (
                <p><strong>Note du client :</strong> {selectedOrder.notes}</p>
              )}
            </div>

            {/* Itemized List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Produits commandés
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-3 bg-white">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{it.productName}</p>
                      <p className="text-[11px] text-stone-500">
                        {it.quantity} pièce{it.quantity > 1 ? 's' : ''} × {formatFCFA(it.unitPrice)}
                      </p>
                    </div>
                    <span className="font-serif font-bold text-stone-900 tabular-nums">
                      {formatFCFA(it.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between border-t border-stone-200 pt-3">
              <span className="text-xs font-bold uppercase text-stone-600">
                Total Produits
              </span>
              <span className="font-serif text-xl font-bold text-stone-950 tabular-nums">
                {formatFCFA(selectedOrder.total)}
              </span>
            </div>

            {/* Direct WhatsApp Contact Button */}
            <div className="pt-2 flex gap-3">
              <a
                href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Écrire au client sur WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedOrder(null)}
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
