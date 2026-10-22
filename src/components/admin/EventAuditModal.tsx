import React, { useState } from 'react';
import { useGraduation } from '../../context/GraduationContext';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  Building,
  Users,
  ShieldCheck,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EventAuditModal: React.FC = () => {
  const {
    event,
    students,
    totalAuditedLiquidationPercent,
    studentsLiquidatedCount,
    totalPending,
    daysUntilDeadline,
    isPastDeadline,
    releaseEventLogistics,
    sendReminder,
  } = useGraduation();

  const [releaseSuccess, setReleaseSuccess] = useState(false);

  const pendingStudents = students.filter((s) => s.balanceRemaining > 0);
  const isAllLiquidated = pendingStudents.length === 0;

  const handleRelease = () => {
    if (isAllLiquidated) {
      releaseEventLogistics();
      setReleaseSuccess(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Auditoría de Cierre y Liquidación (3 Semanas Antes)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verificación automática del 100% de liquidación previa a la liberación de la logística del evento.
          </p>
        </div>
      </div>

      {/* Main Audit Status Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          event.isReleasedForLogistics
            ? 'bg-emerald-950 text-white border-emerald-800'
            : isAllLiquidated
            ? 'bg-amber-950 text-white border-amber-800'
            : 'bg-white text-slate-900 border-slate-200'
        } shadow-md`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10">
              <Clock className="w-3.5 h-3.5" />
              <span>Plazo Límite: {event.liquidationDeadlineDate} ({daysUntilDeadline} días)</span>
            </div>

            <h2 className="text-xl font-bold">
              {event.isReleasedForLogistics
                ? '¡Evento Oficialmente Liberado para Logística Final!'
                : isAllLiquidated
                ? '¡Auditoría Superada! El 100% de los 30 Alumnos ha Liquidado'
                : 'Auditoría en Curso: Pendientes de Liquidación'}
            </h2>

            <p className="text-xs opacity-90 leading-relaxed">
              {event.isReleasedForLogistics
                ? 'El comisionado financiero ha validado el saldo cero. La producción final de gafetes con holograma, reservación del salón y catering están 100% autorizados.'
                : isAllLiquidated
                ? 'Todos los 30 graduados de la Universidad Bancaria completaron el pago total de sus paquetes y boletos extra. Procede a liberar el evento.'
                : `Se requiere que los ${pendingStudents.length} alumnos restantes liquiden su saldo ($${totalPending.toLocaleString('es-MX')} MXN) antes de la fecha límite estricta.`}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-3 w-full md:w-auto">
            <div className="text-right">
              <div className="text-3xl font-black tabular-nums">
                {totalAuditedLiquidationPercent}%
              </div>
              <div className="text-xs opacity-80">
                {studentsLiquidatedCount} de {students.length} Liquidados
              </div>
            </div>

            {isAllLiquidated && !event.isReleasedForLogistics && (
              <button
                onClick={handleRelease}
                type="button"
                className="w-full md:w-auto px-6 py-3 font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Liberar Evento para Logística Final</span>
              </button>
            )}

            {event.isReleasedForLogistics && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Logística 100% Liberada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Students List if not 100% */}
      {!isAllLiquidated && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Alumnos con Saldo Pendiente para Auditoría ({pendingStudents.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-900 tabular-nums">
              Saldo Restante: ${totalPending.toLocaleString('es-MX')} MXN
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Alumno</th>
                  <th className="py-3 px-4 text-right">Adeudo Pendiente</th>
                  <th className="py-3 px-4 text-right">Avance</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{s.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{s.studentId} · {s.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-amber-900 tabular-nums">
                      ${s.balanceRemaining.toLocaleString('es-MX')} MXN
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums text-slate-700">
                      {s.percentPaid}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          sendReminder(s.id, 'whatsapp');
                          alert(`Recordatorio de cierre enviado a ${s.fullName}`);
                        }}
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                      >
                        <Send className="w-3 h-3 text-emerald-600" />
                        <span>Notificar Urgencia</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Logistics Checklist if released */}
      {event.isReleasedForLogistics && (
        <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Checklist de Logística Final Autorizada
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Emisión de Boletos Físicos y Digitales</div>
                <div className="text-[11px] text-slate-500">30 paquetes + 48 boletos extra autorizados</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Pago Liquidado al Salón y Banquetero</div>
                <div className="text-[11px] text-slate-500">Garantía 100% cubierta con fondos del evento</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Kits de Graduación y Medallas de Honor</div>
                <div className="text-[11px] text-slate-500">Togas, birretes y estolas con logo institucional</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Asignación de Mesas y Protocolo</div>
                <div className="text-[11px] text-slate-500">Acomodo final de los 30 graduados e invitados</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
