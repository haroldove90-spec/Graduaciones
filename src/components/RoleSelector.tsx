import React from 'react';
import { Role } from '../types';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, GraduationCap, CalendarCheck2, BadgeDollarSign } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: Role) => void;
}

interface RoleCardItem {
  id: Role;
  name: string;
  icon: React.ReactNode;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles: RoleCardItem[] = [
    {
      id: 'admin',
      name: 'Administrador / Organizador',
      icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
    },
    {
      id: 'student',
      name: 'Alumno / Graduado',
      icon: <GraduationCap className="w-8 h-8 text-amber-400" />,
    },
    {
      id: 'coordinator',
      name: 'Coordinador de Evento',
      icon: <CalendarCheck2 className="w-8 h-8 text-amber-500" />,
    },
    {
      id: 'auditor',
      name: 'Auditoría & Cobranza',
      icon: <BadgeDollarSign className="w-8 h-8 text-amber-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-10 select-none">
      {/* Central Brand Emblem */}
      <div className="mb-6 sm:mb-12 flex flex-col items-center">
        <BrandLogo size="lg" showText={true} variant="light" className="sm:hidden" />
        <BrandLogo size="xl" showText={true} variant="light" className="hidden sm:inline-flex" />
      </div>

      {/* Grid: 2 columns on mobile, 4 columns on desktop. Strictly NO header, NO descriptions, only logo and role name */}
      <div className="w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {roles.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectRole(item.id)}
            type="button"
            className="group relative flex flex-col items-center justify-center p-4 sm:p-8 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/60 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-200 active:scale-98 cursor-pointer text-center"
          >
            <div className="mb-3.5 sm:mb-5 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 group-hover:border-amber-500/50 group-hover:scale-105 transition-transform duration-200 shadow-inner">
              <BrandLogo size="md" variant="gold" />
            </div>

            <span className="text-xs sm:text-base font-semibold text-white group-hover:text-amber-300 transition-colors tracking-tight leading-snug">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
