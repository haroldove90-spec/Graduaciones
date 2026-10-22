import React from 'react';
import { Role } from '../types';
import { useGraduation } from '../context/GraduationContext';
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface DesktopSidebarProps {
  currentRole: Role;
  activeModule: string;
  onSelectModule: (module: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentRole,
  activeModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { event, studentsInactiveCount, totalAuditedLiquidationPercent, daysUntilDeadline } = useGraduation();

  const adminNav = [
    {
      id: 'events',
      label: 'Gestión de Eventos',
      subtitle: 'Configuración y paquetes',
      icon: CalendarDays,
    },
    {
      id: 'graduates',
      label: 'CRM & Alumnos',
      subtitle: 'Control de saldos y abonos',
      icon: Users,
    },
    {
      id: 'automation',
      label: 'Automatización & Alertas',
      subtitle: 'WhatsApp y cobranza temprana',
      icon: BellRing,
      badge: studentsInactiveCount > 0 ? `${studentsInactiveCount} en riesgo` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'finances',
      label: 'Finanzas & Webhooks',
      subtitle: 'Conciliación bancaria en vivo',
      icon: WalletCards,
    },
    {
      id: 'audit',
      label: 'Auditoría 3 Semanas',
      subtitle: 'Cierre y liberación de evento',
      icon: FileCheck2,
      badge: `${totalAuditedLiquidationPercent}%`,
      badgeColor: totalAuditedLiquidationPercent === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
    },
  ];

  const studentNav = [
    {
      id: 'account',
      label: 'Mi Estado de Cuenta',
      subtitle: 'Monto total y progreso',
      icon: PieChart,
    },
    {
      id: 'tickets',
      label: 'Boletos Extra',
      subtitle: 'Seleccionar boletos adicionales',
      icon: Ticket,
    },
    {
      id: 'checkout',
      label: 'Abonar a mi Ritmo',
      subtitle: 'OXXO, Transferencias y Tarjetas',
      icon: BadgeDollarSign,
    },
    {
      id: 'receipts',
      label: 'Recibos Digitales',
      subtitle: 'Historial foliado con QR',
      icon: Receipt,
    },
  ];

  const coordinatorNav = [
    {
      id: 'events',
      label: 'Detalles del Evento',
      subtitle: 'Capacidad y fecha',
      icon: CalendarDays,
    },
    {
      id: 'graduates',
      label: 'Padrón de Graduados',
      subtitle: '30 Alumnos inscritos',
      icon: Users,
    },
    {
      id: 'automation',
      label: 'Alertas y Logística',
      subtitle: 'Recordatorios a alumnos',
      icon: BellRing,
    },
    {
      id: 'audit',
      label: 'Auditoría & Entrega',
      subtitle: 'Liberación de logística',
      icon: FileCheck2,
    },
  ];

  const auditorNav = [
    {
      id: 'finances',
      label: 'Conciliación Bancaria',
      subtitle: 'Pasarelas y Webhooks',
      icon: WalletCards,
    },
    {
      id: 'graduates',
      label: 'Seguimiento de Saldos',
      subtitle: 'Historial de adeudos',
      icon: Users,
    },
    {
      id: 'events',
      label: 'Parámetros del Paquete',
      subtitle: 'Regla de 3 semanas',
      icon: CalendarDays,
    },
    {
      id: 'audit',
      label: 'Auditoría 3 Semanas',
      subtitle: 'Liquidación al 100%',
      icon: FileCheck2,
    },
  ];

  let navItems = adminNav;
  if (currentRole === 'student') navItems = studentNav;
  if (currentRole === 'coordinator') navItems = coordinatorNav;
  if (currentRole === 'auditor') navItems = auditorNav;

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 select-none ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Banner / Event quick glance */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-xs font-bold text-slate-800 truncate">
                {event.school}
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              30 Alumnos
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 truncate">{event.career}</p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Límite 3S:
            </span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {daysUntilDeadline} días restantes
            </span>
          </div>
        </div>
      )}

      {/* Main Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
          {!isCollapsed && 'Módulos del Sistema'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              type="button"
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left group ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs ring-1 ring-amber-400/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 font-medium'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
                  <div className="truncate">
                    <div className="text-xs font-semibold leading-tight truncate">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] leading-tight truncate ${
                        isActive ? 'text-amber-950' : 'text-slate-600'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 tabular-nums ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Collapse Toggle */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Graduaciones Pro</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          type="button"
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-auto"
          title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
