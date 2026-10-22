import React, { useState } from 'react';
import { useGraduation } from '../../context/GraduationContext';
import { GraduateStudent } from '../../types';
import {
  BellRing,
  AlertTriangle,
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';

export const AutomationAlerts: React.FC = () => {
  const { students, event, reminders, sendReminder, daysUntilDeadline } = useGraduation();

  const [activeTab, setActiveTab] = useState<'early_alerts' | 'scheduler' | 'history'>('early_alerts');
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState<GraduateStudent | null>(null);
  const [customChannel, setCustomChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [customMsg, setCustomMsg] = useState('');
  const [dispatchedSuccess, setDispatchedSuccess] = useState<string | null>(null);

  // Filter inactive students (months without payment >= 2 or > 60 days without abono)
  const inactiveStudents = students.filter(
    (s) => (s.monthsWithoutPayment >= 2 || s.status === 'inactive') && s.balanceRemaining > 0
  );

  const handleOpenAlertModal = (student: GraduateStudent, channel: 'whatsapp' | 'email') => {
    setSelectedStudentForAlert(student);
    setCustomChannel(channel);
    const msg =
      channel === 'whatsapp'
        ? `🎓 *Alerta de Graduaciones - ${event.school}*\n\nHola ${student.fullName.split(' ')[0]}, notamos que tienes *${student.monthsWithoutPayment} meses sin registrar abono* para tu evento del ${event.generation}.\n\nTu saldo pendiente actual es de *$${student.balanceRemaining.toLocaleString('es-MX')} MXN*.\nRecuerda que la fecha límite estricta de liquidación es el *${event.liquidationDeadlineDate}* (a 3 semanas del evento).\n\nRealiza un abono libre a tu propio ritmo aquí:\n👉 https://graduaciones.app/abono?ref=${student.studentId}`
        : `Estimado/a ${student.fullName},\n\nLe notificamos formalmente del estado de cuenta de su ceremonia de graduación en ${event.school}.\nRegistramos inactividad de pagos en los últimos ${student.monthsWithoutPayment} meses. Su saldo deudor pendiente es de $${student.balanceRemaining.toLocaleString('es-MX')} MXN.\n\nFecha límite estricta: ${event.liquidationDeadlineDate}.\nAtentamente,\nComité Organizador de Graduaciones`;
    setCustomMsg(msg);
  };

  const handleSendSingleAlert = () => {
    if (!selectedStudentForAlert) return;
    sendReminder(selectedStudentForAlert.id, customChannel, customMsg);
    setDispatchedSuccess(`Alerta enviada exitosamente a ${selectedStudentForAlert.fullName} vía ${customChannel.toUpperCase()}`);
    setSelectedStudentForAlert(null);
    setTimeout(() => setDispatchedSuccess(null), 4000);
  };

  const handleBlastAllInactives = () => {
    inactiveStudents.forEach((student) => {
      sendReminder(student.id, 'whatsapp');
    });
    setDispatchedSuccess(`¡Motor de automatización disparó recordatorios vía WhatsApp a ${inactiveStudents.length} alumnos inactivos!`);
    setTimeout(() => setDispatchedSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Motor de Automatización y Alertas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Detección temprana de graduados inactivos y motor de recordatorios automáticos multicanal (WhatsApp y Email).
          </p>
        </div>

        {inactiveStudents.length > 0 && (
          <button
            onClick={handleBlastAllInactives}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <Zap className="w-4 h-4" />
            <span>Disparar Alertas a Todos ({inactiveStudents.length})</span>
          </button>
        )}
      </div>

      {dispatchedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{dispatchedSuccess}</span>
        </div>
      )}

      {/* Tabs / Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('early_alerts')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
            activeTab === 'early_alerts'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Alumnos en Riesgo / Inactivos ({inactiveStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scheduler')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
            activeTab === 'scheduler'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Motor Mensual Programado</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
            activeTab === 'history'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Historial de Envíos ({reminders.length})</span>
        </button>
      </div>

      {/* TAB 1: EARLY ALERTS */}
      {activeTab === 'early_alerts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">
                  Regla de Cobranza Preventiva Activa
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  El sistema marca en alerta roja a alumnos con más de 2 meses continuos sin registrar abonos. Faltan{' '}
                  <strong className="underline">{daysUntilDeadline} días</strong> para el cierre estricto de liquidación.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-200/80 text-amber-900 tabular-nums">
              {inactiveStudents.length} casos detectados
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Alumno en Alerta</th>
                    <th className="py-3 px-4">Inactividad</th>
                    <th className="py-3 px-4 text-right">Saldo Deudor</th>
                    <th className="py-3 px-4">Último Abono</th>
                    <th className="py-3 px-4 text-right">Acción Rápida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inactiveStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-bold text-slate-700 text-sm">
                          ¡Excelente! No hay alumnos en inactividad crítica
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Todos los graduados han abonado en los últimos 30 días.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    inactiveStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{s.fullName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono">{s.studentId}</span>
                            <span>·</span>
                            <span>{s.phone}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            {s.monthsWithoutPayment} meses sin abono
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-rose-700 tabular-nums">
                          ${s.balanceRemaining.toLocaleString('es-MX')} MXN
                        </td>

                        <td className="py-3 px-4 text-slate-600 font-medium tabular-nums">
                          {s.lastPaymentDate || 'Sin abono previo'}
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenAlertModal(s, 'whatsapp')}
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleOpenAlertModal(s, 'email')}
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-600" />
                            <span>Correo</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATION ENGINE RULES */}
      {activeTab === 'scheduler' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Configuración del Motor de Cobranza Mensual Automático
            </h3>
            <p className="text-slate-500 mt-1">
              Las alertas se disparan sin intervención humana en las fechas programadas hacia la base de graduados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Recordatorio WhatsApp Día 1 y 15 de cada mes
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Activo
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Envía un resumen de saldo y enlace directo para abono libre a todos los alumnos que tengan saldo pendiente mayor a $0.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Alerta Crítica a 3 Semanas Previas
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Programado para: {event.liquidationDeadlineDate}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Bloqueo automático de adquisición de boletos extra y envío de ultimátum de liquidación para garantizar el cupo del evento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORY OF ALERTS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Registro de Recordatorios Despachados</h3>
            <span className="text-slate-500 text-xs">{reminders.length} registros</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {reminders.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                No hay recordatorios enviados en el historial.
              </div>
            ) : (
              reminders.map((r) => (
                <div key={r.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{r.studentName}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {r.channel}
                      </span>
                      <span className="text-slate-400 text-[11px]">{r.sentDate}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] max-w-2xl bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{r.message}"
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Entregado</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {selectedStudentForAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Enviar Alerta Temprana a {selectedStudentForAlert.fullName}
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Canal de Envío</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomChannel('whatsapp')}
                    className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-semibold ${
                      customChannel === 'whatsapp'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp ({selectedStudentForAlert.phone})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomChannel('email')}
                    className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-semibold ${
                      customChannel === 'email'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Correo ({selectedStudentForAlert.email})</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mensaje Personalizado con Enlace de Pago
                </label>
                <textarea
                  rows={6}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 text-xs">
              <button
                onClick={() => setSelectedStudentForAlert(null)}
                type="button"
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendSingleAlert}
                type="button"
                className="px-4 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Despachar Alerta Ahora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
