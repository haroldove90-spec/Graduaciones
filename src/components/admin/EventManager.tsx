import React, { useState } from 'react';
import { useGraduation } from '../../context/GraduationContext';
import {
  Calendar,
  Building2,
  GraduationCap,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  Save,
  PlusCircle,
} from 'lucide-react';

export const EventManager: React.FC = () => {
  const { event, updateEvent, createEvent, daysUntilDeadline, daysUntilEvent } = useGraduation();

  const [formData, setFormData] = useState({
    name: event.name,
    school: event.school,
    career: event.career,
    generation: event.generation,
    eventDate: event.eventDate,
    packageCost: event.packageCost,
    totalGraduatesCapacity: event.totalGraduatesCapacity,
    extraTicketPrice: event.extraTicketPrice,
    venueName: event.venueName,
    liquidationDeadlineDate: event.liquidationDeadlineDate,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // Auto calculate strictly 3 weeks before (21 days)
  const handleDateChange = (newDate: string) => {
    const d = new Date(newDate);
    d.setDate(d.getDate() - 21);
    const deadline = d.toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      eventDate: newDate,
      liquidationDeadlineDate: deadline,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvent(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Eventos y Paquetes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configuración integral del evento, paquete base, boletos extra y regla de liquidación a 3 semanas.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Nuevo Evento</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Configuración del evento y reglas de liquidación actualizadas exitosamente!</span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Costo Paquete Base</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums">
            ${event.packageCost.toLocaleString('es-MX')} <span className="text-xs text-slate-600 font-normal">MXN</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Por graduado inscrito</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Capacidad Total</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums">
            {event.totalGraduatesCapacity} <span className="text-xs text-slate-600 font-normal">Alumnos</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">100% de plazas cubiertas</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Precio Boleto Extra</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums">
            ${event.extraTicketPrice.toLocaleString('es-MX')} <span className="text-xs text-slate-600 font-normal">MXN</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Adquisición libre por alumno</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-900 text-xs font-semibold">
            <span>Regla Límite (3 Semanas)</span>
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-950 tabular-nums">
            {daysUntilDeadline} <span className="text-xs text-amber-800 font-normal">días restantes</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-800 font-medium truncate">
            Cierre: {event.liquidationDeadlineDate}
          </div>
        </div>
      </div>

      {/* Main Configuration Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              Parámetros de la Graduación Activa
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
              ID: {event.id}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Escuela / Institución */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Institución Educativa / Escuela
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-medium"
              />
            </div>

            {/* Carrera */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Carrera / Licenciatura
              </label>
              <input
                type="text"
                value={formData.career}
                onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-medium"
              />
            </div>

            {/* Generación */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Generación del Evento
              </label>
              <input
                type="text"
                value={formData.generation}
                onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-medium"
              />
            </div>

            {/* Fecha del Evento */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Fecha de Celebración del Evento
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleDateChange(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-medium"
              />
              <span className="text-[11px] text-slate-600 mt-1 block">
                Faltan {daysUntilEvent} días para la graduación
              </span>
            </div>

            {/* Fecha Límite Estricta de Liquidación */}
            <div>
              <label className="block font-semibold text-amber-900 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                Fecha Límite Estricta (3 Semanas Antes)
              </label>
              <input
                type="date"
                value={formData.liquidationDeadlineDate}
                onChange={(e) =>
                  setFormData({ ...formData, liquidationDeadlineDate: e.target.value })
                }
                required
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/50 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-amber-950 font-bold"
              />
              <span className="text-[11px] text-amber-800 font-semibold mt-1 block">
                Regla institucional: 21 días antes del evento
              </span>
            </div>

            {/* Sede / Salón */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Sede / Salón de Eventos
              </label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-medium"
              />
            </div>

            {/* Costo Base del Paquete */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Costo Base del Paquete ($ MXN)
              </label>
              <input
                type="number"
                value={formData.packageCost}
                onChange={(e) =>
                  setFormData({ ...formData, packageCost: Number(e.target.value) })
                }
                min={0}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-bold tabular-nums"
              />
            </div>

            {/* Capacidad Total Alumnos */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Número Total de Graduados (Capacidad)
              </label>
              <input
                type="number"
                value={formData.totalGraduatesCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, totalGraduatesCapacity: Number(e.target.value) })
                }
                min={1}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-bold tabular-nums"
              />
            </div>

            {/* Costo Boleto Extra */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Costo por Boleto Extra ($ MXN)
              </label>
              <input
                type="number"
                value={formData.extraTicketPrice}
                onChange={(e) =>
                  setFormData({ ...formData, extraTicketPrice: Number(e.target.value) })
                }
                min={0}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-bold tabular-nums"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración del Evento</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal to Register New Event */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Registrar Nuevo Evento de Graduación
            </h3>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nombre del Evento
                </label>
                <input
                  id="new-event-name"
                  type="text"
                  placeholder="Ej. Instituto Politécnico - Generación Mayo 2027"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Escuela</label>
                  <input
                    id="new-school"
                    type="text"
                    placeholder="Universidad Bancaria"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Carrera</label>
                  <input
                    id="new-career"
                    type="text"
                    placeholder="Contabilidad"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Fecha del Evento
                  </label>
                  <input
                    id="new-event-date"
                    type="date"
                    defaultValue="2027-04-15"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Costo Paquete ($)
                  </label>
                  <input
                    id="new-package-cost"
                    type="number"
                    defaultValue={12500}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowNewModal(false)}
                type="button"
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const nameEl = document.getElementById('new-event-name') as HTMLInputElement;
                  const schoolEl = document.getElementById('new-school') as HTMLInputElement;
                  const careerEl = document.getElementById('new-career') as HTMLInputElement;
                  const dateEl = document.getElementById('new-event-date') as HTMLInputElement;
                  const costEl = document.getElementById('new-package-cost') as HTMLInputElement;

                  const evDate = dateEl.value || '2027-04-15';
                  const d = new Date(evDate);
                  d.setDate(d.getDate() - 21);

                  createEvent({
                    name: nameEl.value || 'Nueva Generación de Graduación',
                    school: schoolEl.value || 'Universidad Bancaria',
                    career: careerEl.value || 'Contabilidad',
                    generation: 'Generación 2027',
                    eventDate: evDate,
                    liquidationDeadlineDate: d.toISOString().split('T')[0],
                    packageCost: Number(costEl.value) || 12500,
                    totalGraduatesCapacity: 30,
                    extraTicketPrice: 850,
                    venueName: 'Gran Salón Principal',
                    status: 'active',
                  });

                  setShowNewModal(false);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 3000);
                }}
                type="button"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                Crear Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
