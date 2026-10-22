import React from 'react';
import { Role } from '../types';
import {
  CalendarDays,
  Users,
  BellRing,
  WalletCards,
  FileCheck2,
  Receipt,
  Ticket,
  BadgeDollarSign,
  PieChart,
} from 'lucide-react';

interface BottomNavProps {
  currentRole: Role;
  activeModule: string;
  onSelectModule: (module: string) => void;
  inactiveCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  activeModule,
  onSelectModule,
  inactiveCount = 0,
}) => {
  const adminItems = [
    { id: 'events', label: 'Evento', icon: CalendarDays },
    { id: 'graduates', label: 'Graduados', icon: Users },
    {
      id: 'automation',
      label: 'Alertas',
      icon: BellRing,
      badge: inactiveCount > 0 ? inactiveCount : undefined,
    },
    { id: 'finances', label: 'Finanzas', icon: WalletCards },
    { id: 'audit', label: 'Auditoría', icon: FileCheck2 },
  ];

  const studentItems = [
    { id: 'account', label: 'Mi Cuenta', icon: PieChart },
    { id: 'tickets', label: 'Boletos', icon: Ticket },
    { id: 'checkout', label: 'Abonar', icon: BadgeDollarSign },
    { id: 'receipts', label: 'Recibos', icon: Receipt },
  ];

  const coordinatorItems = [
    { id: 'events', label: 'Evento', icon: CalendarDays },
    { id: 'graduates', label: 'Graduados', icon: Users },
    { id: 'automation', label: 'Alertas', icon: BellRing },
    { id: 'audit', label: 'Liberación', icon: FileCheck2 },
  ];

  const auditorItems = [
    { id: 'finances', label: 'Finanzas', icon: WalletCards },
    { id: 'graduates', label: 'Saldos CRM', icon: Users },
    { id: 'events', label: 'Costos', icon: CalendarDays },
    { id: 'audit', label: 'Auditoría 3S', icon: FileCheck2 },
  ];

  let items = adminItems;
  if (currentRole === 'student') items = studentItems;
  if (currentRole === 'coordinator') items = coordinatorItems;
  if (currentRole === 'auditor') items = auditorItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              type="button"
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-amber-800 font-bold bg-amber-50/70'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-amber-700 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
