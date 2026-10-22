import React, { useState } from 'react';
import { useGraduation } from '../../context/GraduationContext';
import { PaymentRecord, PaymentMethod } from '../../types';
import {
  PieChart,
  Ticket,
  BadgeDollarSign,
  Receipt,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building,
  QrCode,
  Copy,
  Share2,
  Calendar,
  Sparkles,
  ChevronRight,
  Download,
  Barcode,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentPortalProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  activeTab,
  onSelectTab,
  onViewReceipt,
}) => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    event,
    updateStudentExtraTickets,
    registerFlexiblePayment,
    payments,
    daysUntilDeadline,
    daysUntilEvent,
  } = useGraduation();

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  // If no student data available
  if (!currentStudent) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p className="font-bold text-slate-700">No hay alumno seleccionado</p>
        <p className="text-xs text-slate-400 mt-1">
          Por favor inscribe un graduado o restaura los datos de muestra.
        </p>
      </div>
    );
  }

  // Local state for tickets selector
  const [ticketCount, setTicketCount] = useState<number>(currentStudent.extraTicketsCount);
  const [ticketsSavedNotice, setTicketsSavedNotice] = useState(false);

  // Local state for checkout
  const [abonoAmount, setAbonoAmount] = useState<number>(
    currentStudent.balanceRemaining > 0 ? Math.min(1500, currentStudent.balanceRemaining) : 500
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('oxxo');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutSuccessPayment, setCheckoutSuccessPayment] = useState<PaymentRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Student specific payments
  const studentPayments = payments.filter((p) => p.graduateId === currentStudent.id);

  const handleUpdateTickets = () => {
    updateStudentExtraTickets(currentStudent.id, ticketCount);
    setTicketsSavedNotice(true);
    setTimeout(() => setTicketsSavedNotice(false), 3000);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      const record = registerFlexiblePayment(
        currentStudent.id,
        abonoAmount,
        selectedMethod,
        undefined,
        `Abono voluntario en línea vía ${selectedMethod.toUpperCase()}`
      );

      setIsProcessingPayment(false);
      setCheckoutSuccessPayment(record);

      if (currentStudent.balanceRemaining - abonoAmount <= 0) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }, 600);
  };

  const handleCopyPaymentLink = () => {
    const url = `${window.location.origin}/portal?matricula=${currentStudent.studentId}&monto=${abonoAmount}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Compact Responsive Student Switcher Banner */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
            {currentStudent.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
              {currentStudent.fullName}
            </div>
            <div className="text-[11px] text-slate-500 font-mono truncate">
              {currentStudent.studentId} · {event.school}
            </div>
          </div>
        </div>

        {/* Student selector dropdown */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <label className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
            Graduado:
          </label>
          <select
            value={currentStudent.id}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              const s = students.find((st) => st.id === e.target.value);
              if (s) {
                setTicketCount(s.extraTicketsCount);
                setAbonoAmount(s.balanceRemaining > 0 ? Math.min(1500, s.balanceRemaining) : 500);
                setCheckoutSuccessPayment(null);
              }
            }}
            className="flex-1 sm:flex-none px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:border-amber-500 outline-none max-w-full sm:max-w-[210px] truncate"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.fullName} ({st.percentPaid}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: MI ESTADO DE CUENTA */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Main Hero Card: Balance & Countdown */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-slate-900 via-slate-900 to-amber-950 p-4 sm:p-7 text-white shadow-xl border border-slate-800">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
              <div className="space-y-2 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-semibold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{event.career}</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight truncate">
                  {currentStudent.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {event.name} · Sede: {event.venueName}
                </p>

                {/* Deadlines Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Límite Estricto (3 Semanas): <strong>{event.liquidationDeadlineDate}</strong></span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    Faltan {daysUntilDeadline} días para cierre
                  </span>
                </div>
              </div>

              {/* Progress Ring / Gauge */}
              <div className="shrink-0 flex flex-col items-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[200px]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  Progreso de Liquidación
                </span>
                <div className="my-2 text-4xl sm:text-5xl font-black text-amber-400 tabular-nums">
                  {currentStudent.percentPaid}%
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentStudent.percentPaid}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-300 mt-2">
                  {currentStudent.balanceRemaining <= 0
                    ? '¡Cuenta 100% Liquidada!'
                    : `Resta: $${currentStudent.balanceRemaining.toLocaleString('es-MX')} MXN`}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Monto Total a Pagar</span>
              <div className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">
                ${currentStudent.totalDebt.toLocaleString('es-MX')}{' '}
                <span className="text-xs text-slate-600 font-normal">MXN</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 space-y-0.5 border-t border-slate-100 pt-2">
                <div>Paquete Base: ${currentStudent.basePackageCost.toLocaleString('es-MX')}</div>
                <div>
                  {currentStudent.extraTicketsCount} Boletos Extra: +$
                  {(currentStudent.extraTicketsCount * event.extraTicketPrice).toLocaleString('es-MX')}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Abonado a la Fecha</span>
              <div className="mt-1.5 text-2xl font-black text-emerald-800 tabular-nums">
                ${currentStudent.totalPaid.toLocaleString('es-MX')}{' '}
                <span className="text-xs text-slate-600 font-normal">MXN</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 border-t border-slate-100 pt-2 font-medium">
                {studentPayments.length} depósitos validados
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
              <span className="text-xs font-semibold text-amber-900">Saldo Restante Pendiente</span>
              <div className="mt-1.5 text-2xl font-black text-amber-950 tabular-nums">
                ${currentStudent.balanceRemaining.toLocaleString('es-MX')}{' '}
                <span className="text-xs text-amber-800 font-normal">MXN</span>
              </div>
              <div className="mt-2 text-[11px] text-amber-800 border-t border-amber-200/60 pt-2 font-medium">
                {currentStudent.balanceRemaining <= 0
                  ? 'Sin adeudos pendientes'
                  : 'Abonos libres disponibles'}
              </div>
            </div>
          </div>

          {/* Quick CTA to pay if balance > 0 */}
          {currentStudent.balanceRemaining > 0 && (
            <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  ¿Listo para realizar un abono libre?
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  No hay cuotas fijas obligatorias. Puedes abonar desde $100 MXN en OXXO, SPEI o tarjeta.
                </p>
              </div>
              <button
                onClick={() => onSelectTab('checkout')}
                className="px-5 py-2.5 font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors shrink-0"
              >
                Hacer Abono Ahora
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOLETOS EXTRA */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Selección de Boletos Extra para tu Graduación
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cada boleto extra incluye acceso completo a la recepción, cena formal de 3 tiempos, barra libre y brindis.
            </p>
          </div>

          {ticketsSavedNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Cantidad de boletos actualizada y recalculada en tu estado de cuenta!</span>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-xl mx-auto space-y-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Boletos adicionales deseados
            </span>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setTicketCount(Math.max(0, ticketCount - 1))}
                type="button"
                className="w-12 h-12 rounded-2xl bg-white border border-slate-300 shadow-xs text-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center"
              >
                -
              </button>

              <div className="text-5xl font-black text-slate-900 tabular-nums">
                {ticketCount}
              </div>

              <button
                onClick={() => setTicketCount(ticketCount + 1)}
                type="button"
                className="w-12 h-12 rounded-2xl bg-white border border-slate-300 shadow-xs text-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center"
              >
                +
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Precio unitario: <strong>${event.extraTicketPrice.toLocaleString('es-MX')} MXN</strong> c/u
            </div>

            {/* Dynamic recalculation preview */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Costo adicional por {ticketCount} boletos:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  +${(ticketCount * event.extraTicketPrice).toLocaleString('es-MX')} MXN
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nuevo Monto Total:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ${(currentStudent.basePackageCost + ticketCount * event.extraTicketPrice).toLocaleString('es-MX')} MXN
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-amber-900">
                <span>Nuevo Saldo Restante:</span>
                <span className="tabular-nums">
                  ${Math.max(
                    0,
                    currentStudent.basePackageCost +
                      ticketCount * event.extraTicketPrice -
                      currentStudent.totalPaid
                  ).toLocaleString('es-MX')}{' '}
                  MXN
                </span>
              </div>
            </div>

            <button
              onClick={handleUpdateTickets}
              type="button"
              className="w-full py-3 px-6 font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors"
            >
              Confirmar y Actualizar Cuenta
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CHECKOUT Y ABONO FLEXIBLE */}
      {activeTab === 'checkout' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Abonos Flexibles y Generación de Métodos de Pago
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Abona cualquier cantidad libre a tu propio ritmo. Elige pago digital o genera tu ficha de depósito para OXXO / 7-Eleven.
            </p>
          </div>

          {checkoutSuccessPayment ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-4 max-w-lg mx-auto">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-emerald-900">
                    ¡Abono Acreditado Exitosamente!
                  </h3>
                  <p className="text-slate-600 text-[11px]">
                    Tu pago ha sido registrado e impactado en tu estado de cuenta.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 space-y-2 text-slate-800">
                <div className="flex justify-between">
                  <span>Monto abonado:</span>
                  <strong className="text-emerald-800">
                    ${checkoutSuccessPayment.amount.toLocaleString('es-MX')} MXN
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Folio de Recibo:</span>
                  <strong className="font-mono">{checkoutSuccessPayment.receiptNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Referencia de Pago:</span>
                  <span className="font-mono">{checkoutSuccessPayment.referenceCode}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => onViewReceipt(checkoutSuccessPayment)}
                  className="px-4 py-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Ver Recibo Digital</span>
                </button>
                <button
                  onClick={() => setCheckoutSuccessPayment(null)}
                  className="px-4 py-2 font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800"
                >
                  Realizar Otro Abono
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleExecutePayment} className="space-y-6 max-w-2xl mx-auto text-xs">
              {/* Amount selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  1. ¿Cuánto deseas abonar hoy? ($ MXN)
                </label>
                <input
                  type="number"
                  value={abonoAmount}
                  onChange={(e) => setAbonoAmount(Number(e.target.value))}
                  min={1}
                  max={currentStudent.balanceRemaining > 0 ? currentStudent.balanceRemaining : 100000}
                  required
                  className="w-full px-4 py-3 text-lg font-black rounded-xl border border-slate-300 focus:border-amber-500 outline-none tabular-nums text-slate-900"
                />

                {/* Quick amount shortcuts */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[500, 1000, 2000, 3000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAbonoAmount(Math.min(val, currentStudent.balanceRemaining))}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                    >
                      +${val.toLocaleString('es-MX')}
                    </button>
                  ))}
                  {currentStudent.balanceRemaining > 0 && (
                    <button
                      type="button"
                      onClick={() => setAbonoAmount(currentStudent.balanceRemaining)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs ml-auto"
                    >
                      Liquidar Todo (${currentStudent.balanceRemaining.toLocaleString('es-MX')} MXN)
                    </button>
                  )}
                </div>
              </div>

              {/* Method selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  2. Selecciona tu método o canal de pago
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      selectedMethod === 'oxxo'
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="oxxo"
                      checked={selectedMethod === 'oxxo'}
                      onChange={() => setSelectedMethod('oxxo')}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold text-xs">
                      OXXO
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">OXXO Pay (Efectivo)</div>
                      <div className="text-[11px] text-slate-500">Genera código de barras y referencia</div>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      selectedMethod === 'transfer'
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={selectedMethod === 'transfer'}
                      onChange={() => setSelectedMethod('transfer')}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Transferencia SPEI</div>
                      <div className="text-[11px] text-slate-500">CLABE interbancaria personalizada</div>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      selectedMethod === 'mercadopago'
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercadopago"
                      checked={selectedMethod === 'mercadopago'}
                      onChange={() => setSelectedMethod('mercadopago')}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center shrink-0 font-bold text-xs">
                      MP
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Mercado Pago / Billetera</div>
                      <div className="text-[11px] text-slate-500">Saldo o tarjetas guardadas</div>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={selectedMethod === 'card'}
                      onChange={() => setSelectedMethod('card')}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4 text-purple-700" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Tarjeta Débito / Crédito</div>
                      <div className="text-[11px] text-slate-500">Visa, MasterCard, Amex</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Method Detailed Preview Box */}
              {selectedMethod === 'oxxo' && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between text-amber-950 font-bold">
                    <span>Ficha Digital de Depósito OXXO Pay</span>
                    <span className="font-mono text-xs">Vence en 48 hrs</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-center font-mono">
                    <div className="text-[10px] text-slate-400">REFERENCIA NUMÉRICA (14 DÍGITOS)</div>
                    <div className="text-base sm:text-lg font-bold tracking-widest text-slate-900 my-1">
                      9384 1029 4820 18
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Indica al cajero de OXXO que deseas realizar un pago de servicio OXXO Pay.
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'transfer' && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                  <span className="font-bold text-blue-950">Datos para Transferencia SPEI</span>
                  <div className="p-3 bg-white rounded-xl border border-blue-200 font-mono text-slate-800 space-y-1 text-[11px]">
                    <div>Banco: <strong>STP / BBVA Bancomer</strong></div>
                    <div>CLABE: <strong>6461 8012 3456 7890 12</strong></div>
                    <div>Beneficiario: <strong>Graduaciones Pro S.A. de C.V.</strong></div>
                    <div>Concepto: <strong>{currentStudent.studentId}</strong></div>
                  </div>
                </div>
              )}

              {/* Action Buttons & Share Link */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 px-6 font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <span>Procesando Acreditación...</span>
                  ) : (
                    <>
                      <span>Abonar ${abonoAmount.toLocaleString('es-MX')} MXN Ahora</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Personalized Shareable Link */}
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>¿Prefieres que un familiar pague por ti?</span>
                  <button
                    type="button"
                    onClick={handleCopyPaymentLink}
                    className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar enlace personalizado'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: MIS COMPROBANTES Y RECIBOS */}
      {activeTab === 'receipts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Historial de Recibos y Comprobantes Digitales
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprobantes oficiales emitidos tras cada depósito con código QR de verificación.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              {studentPayments.length} Recibos
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {studentPayments.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Aún no tienes recibos emitidos</p>
                <p className="text-xs text-slate-400 mt-1">
                  En cuanto realices un abono libre, tu comprobante aparecerá aquí inmediatamente.
                </p>
              </div>
            ) : (
              studentPayments.map((p) => (
                <div
                  key={p.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-3 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {p.receiptNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Ref: {p.referenceCode} · Canal: {p.paymentMethod.toUpperCase()}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Fecha: {p.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-800 tabular-nums">
                        ${p.amount.toLocaleString('es-MX')} MXN
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-700 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Acreditado</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onViewReceipt(p)}
                      type="button"
                      className="px-3.5 py-2 font-semibold text-xs text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Descargar</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
