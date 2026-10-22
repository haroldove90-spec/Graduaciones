import React, { useState } from 'react';
import { useGraduation } from '../context/GraduationContext';
import {
  Database,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Copy,
  X,
  ExternalLink,
  Server,
  AlertTriangle,
  Code2,
} from 'lucide-react';

interface DataManagementModalProps {
  onClose: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({ onClose }) => {
  const {
    isSampleDataCleared,
    clearAllSampleData,
    restoreSampleData,
    students,
    payments,
  } = useGraduation();

  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isCopiedSQL, setIsCopiedSQL] = useState(false);
  const [activeTab, setActiveTab] = useState<'sample_control' | 'supabase'>('sample_control');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const sqlSchemaScript = `-- ========================================================
-- ESQUEMA SQL PARA GRADUACIONES EN SUPABASE
-- ========================================================

-- 1. Tabla de Eventos de Graduación
CREATE TABLE IF NOT EXISTS public.graduation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  career TEXT NOT NULL,
  generation TEXT NOT NULL,
  event_date DATE NOT NULL,
  liquidation_deadline_date DATE NOT NULL, -- Estrictamente 3 semanas antes
  package_cost NUMERIC(12,2) NOT NULL DEFAULT 12500.00,
  total_graduates_capacity INT NOT NULL DEFAULT 30,
  extra_ticket_price NUMERIC(12,2) NOT NULL DEFAULT 850.00,
  venue_name TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Graduados Inscritos
CREATE TABLE IF NOT EXISTS public.graduates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.graduation_events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  extra_tickets_count INT DEFAULT 0,
  base_package_cost NUMERIC(12,2) NOT NULL,
  total_paid NUMERIC(12,2) DEFAULT 0.00,
  last_payment_date DATE,
  status TEXT DEFAULT 'on_track',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Pagos y Abonos Flexibles
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  graduate_id UUID REFERENCES public.graduates(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL,
  reference_code TEXT NOT NULL UNIQUE,
  receipt_number TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMANDO PARA BORRAR TODOS LOS REGISTROS REMOTOS EN SUPABASE:
-- TRUNCATE TABLE public.payments, public.graduates, public.graduation_events RESTART IDENTITY CASCADE;
`;

  const handleClearSample = () => {
    if (
      window.confirm(
        '¿Deseas borrar todos los datos de muestra del navegador? El sistema no volverá a mostrar datos de demostración automáticamente.'
      )
    ) {
      clearAllSampleData();
      setActionNotice('Todos los datos de muestra han sido eliminados permanentemente.');
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleRestoreSample = () => {
    restoreSampleData();
    setActionNotice('Se han restaurado los datos de muestra (30 alumnos de Universidad Bancaria).');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setIsCopiedSQL(true);
    setTimeout(() => setIsCopiedSQL(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 text-slate-900 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Gestión de Datos & Preparación Supabase
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Control de datos locales de demostración y sincronización con base de datos en la nube.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 flex gap-2 border-b border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sample_control')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'sample_control'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Datos de Muestra en Navegador
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'supabase'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Integración Supabase (SQL & Borrado Remoto)
          </button>
        </div>

        {actionNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {activeTab === 'sample_control' ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Estado Actual de los Datos:</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isSampleDataCleared
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {isSampleDataCleared
                      ? 'Datos de Muestra Borrados'
                      : 'Datos de Muestra Activos'}
                  </span>
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  Alumnos en padrón: <strong>{students.length}</strong> · Recibos emitidos: <strong>{payments.length}</strong>
                </div>
              </div>

              {/* Botón Borrar Datos de Muestra */}
              <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-3">
                <div className="flex items-center gap-2 font-bold text-rose-950">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Borrar Datos de Muestra Permanentemente</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Elimina todos los alumnos, pagos y alertas de demostración. Se activa una bandera en tu navegador para que <strong>nunca se vuelvan a cargar los datos de muestra</strong> automáticamente, dejando el sistema listo para producción.
                </p>
                <button
                  onClick={handleClearSample}
                  type="button"
                  className="px-4 py-2 font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Borrar Datos de Muestra Ahora</span>
                </button>
              </div>

              {/* Botón Restaurar Datos de Muestra (opcional para pruebas) */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <RotateCcw className="w-4 h-4 text-slate-600" />
                  <span>Restaurar Datos de Demostración</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Si deseas realizar una demostración del flujo con los 30 graduados de la Universidad Bancaria, puedes restaurar los datos con un solo clic.
                </p>
                <button
                  onClick={handleRestoreSample}
                  type="button"
                  className="px-4 py-2 font-semibold text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrón de 30 Alumnos</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Server className="w-4 h-4 text-amber-700" />
                  <span>Conexión y Limpieza en Supabase</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Para sincronizar y poder borrar registros en Supabase una vez configurada tu base de datos PostgreSQL, ejecuta el script de migración a continuación.
                </p>
              </div>

              {/* Credential inputs for when user connects Supabase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Supabase Anon Key
                  </label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* SQL Viewer */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-slate-600" />
                    Script de Esquema y Borrado (SQL DDL)
                  </span>
                  <button
                    onClick={handleCopySQL}
                    type="button"
                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-semibold text-[11px] flex items-center gap-1.5 hover:bg-slate-800"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopiedSQL ? '¡Copiado!' : 'Copiar SQL'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                  {sqlSchemaScript}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 font-bold text-xs bg-slate-900 text-white rounded-xl hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
