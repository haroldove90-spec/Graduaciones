import React, { useState } from 'react';
import { Role } from '../types';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { LogOut, Database, UserCheck, ChevronDown } from 'lucide-react';

interface UnifiedHeaderProps {
  currentRole: Role;
  onLogout: () => void;
  onSwitchRole: (role: Role) => void;
  onOpenDataManagement: () => void;
  studentName?: string;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentRole,
  onLogout,
  onSwitchRole,
  onOpenDataManagement,
  studentName,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleLabels: Record<Role, string> = {
    admin: 'Administrador / Organizador',
    student: 'Alumno / Graduado',
    coordinator: 'Coordinador de Evento',
    auditor: 'Auditoría & Finanzas',
  };

  const roleShortLabels: Record<Role, string> = {
    admin: 'Organizador',
    student: studentName ? studentName.split(' ')[0] : 'Graduado',
    coordinator: 'Logística',
    auditor: 'Finanzas',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Logotipo del sistema (responsive) */}
        <div className="flex items-center gap-2 shrink-0">
          <BrandLogo size="sm" showText={false} variant="light" className="sm:hidden" />
          <BrandLogo size="md" showText={true} variant="light" className="hidden sm:inline-flex" />
          {/* Mobile title text */}
          <div className="sm:hidden flex flex-col leading-tight">
            <span className="font-bold text-xs text-white tracking-tight">Graduaciones</span>
            <span className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold">Pro</span>
          </div>
        </div>

        {/* Right side: Role badge, quick actions (PWA install, Data, Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Active Role Selector / Badge with quick switch */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              type="button"
              className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              title="Cambiar de rol"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden md:inline font-semibold text-white leading-none">
                {roleLabels[currentRole]}
              </span>
              <span className="md:hidden font-semibold text-white leading-none max-w-[70px] sm:max-w-none truncate text-[11px] sm:text-xs">
                {roleShortLabels[currentRole]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 sm:w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-1 z-50 text-slate-200 text-xs"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-700/70">
                  Cambiar Rol Activo
                </div>
                {(['admin', 'student', 'coordinator', 'auditor'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onSwitchRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700 transition-colors ${
                      currentRole === r ? 'font-bold text-amber-400 bg-slate-700/50' : 'text-slate-300'
                    }`}
                  >
                    <span>{roleLabels[r]}</span>
                    {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón de Gestión de Datos (Borrar muestras / Supabase) */}
          <button
            onClick={onOpenDataManagement}
            type="button"
            title="Gestión de base de datos y borrado de muestra"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline ml-1">Datos</span>
          </button>

          {/* Botón de Instalación Rápida PWA */}
          <PWAInstallButton variant="header" />

          {/* Botón de Cierre de Sesión */}
          <button
            onClick={onLogout}
            type="button"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 hover:text-rose-100 text-xs font-semibold transition-colors shadow-xs flex items-center gap-1"
            title="Cerrar sesión y volver al inicio"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};
