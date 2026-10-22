import React, { useState } from 'react';
import { useGraduation } from '../../context/GraduationContext';
import { PaymentRecord, WebhookLog } from '../../types';
import {
  WalletCards,
  CheckCircle2,
  Zap,
  ArrowDownLeft,
  Receipt,
  FileCode,
  ShieldCheck,
  Building,
  CreditCard,
  Barcode,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinanceWebhooksProps {
  onViewReceipt: (payment: PaymentRecord) => void;
}

export const FinanceWebhooks: React.FC<FinanceWebhooksProps> = ({ onViewReceipt }) => {
  const {
    payments,
    webhookLogs,
    students,
    totalCollected,
    totalPending,
    totalExpectedRevenue,
    simulateWebhookPayment,
  } = useGraduation();

  const [selectedGateway, setSelectedGateway] = useState<'mercadopago' | 'oxxopay' | 'stripe'>('mercadopago');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [simulatedAmount, setSimulatedAmount] = useState<number>(2500);
  const [lastWebhookResult, setLastWebhookResult] = useState<{
    payment: PaymentRecord;
    log: WebhookLog;
  } | null>(null);

  // Search filter for payments
  const [searchPay, setSearchPay] = useState('');

  const filteredPayments = payments.filter(
    (p) =>
      p.studentName.toLowerCase().includes(searchPay.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchPay.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(searchPay.toLowerCase())
  );

  const handleSimulateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const res = simulateWebhookPayment(selectedStudentId, simulatedAmount, selectedGateway);
    setLastWebhookResult(res);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Finanzas, Conciliación Bancaria y Webhooks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Validación de pagos multicanal (Mercado Pago, Stripe, OXXO Pay, SPEI) y emisión automática de recibos.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Fondos Conciliados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-800 tabular-nums">
            ${totalCollected.toLocaleString('es-MX')}{' '}
            <span className="text-xs text-slate-600 font-normal">MXN</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Acreditados en cuenta bancaria</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Adeudo Pendiente Global</span>
            <WalletCards className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-900 tabular-nums">
            ${totalPending.toLocaleString('es-MX')}{' '}
            <span className="text-xs text-slate-600 font-normal">MXN</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Por liquidar a 3 semanas</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Eventos Webhook Procesados</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tabular-nums">
            {webhookLogs.length + payments.length}{' '}
            <span className="text-xs text-slate-600 font-normal">Confirmaciones</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            100% conciliación sin discrepancias
          </div>
        </div>
      </div>

      {/* Gateway Simulator Card */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulador de Webhooks en Tiempo Real</span>
            </div>
            <h2 className="text-base font-bold text-white">
              Validar Notificación Instantánea de Depósito
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simula la llamada HTTP POST que envía Mercado Pago, OXXO Pay o Stripe cuando el graduado realiza un abono.
            </p>
          </div>
        </div>

        <form onSubmit={handleSimulateWebhook} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Pasarela / Agregador</label>
            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:border-amber-400 outline-none"
            >
              <option value="mercadopago">Mercado Pago (Webhook IPN)</option>
              <option value="oxxopay">OXXO Pay (Depósito en Caja)</option>
              <option value="stripe">Stripe (Card / Webhook charge)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Alumno Destinatario</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:border-amber-400 outline-none truncate"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentId}) - Saldo: ${s.balanceRemaining}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Monto del Depósito ($ MXN)</label>
            <input
              type="number"
              value={simulatedAmount}
              onChange={(e) => setSimulatedAmount(Number(e.target.value))}
              min={100}
              step={50}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold tabular-nums focus:border-amber-400 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Simular Webhook</span>
            </button>
          </div>
        </form>

        {lastWebhookResult && (
          <div className="p-4 rounded-xl bg-slate-800/90 border border-amber-500/40 text-xs text-slate-200 animate-in fade-in duration-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Webhook 200 OK — Depósito Acreditado Automáticamente
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {lastWebhookResult.log.id}
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              Graduado: <strong>{lastWebhookResult.payment.studentName}</strong> | Monto:{' '}
              <strong className="text-emerald-300">
                ${lastWebhookResult.payment.amount.toLocaleString('es-MX')} MXN
              </strong>{' '}
              | Recibo Digital: <strong>{lastWebhookResult.payment.receiptNumber}</strong>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onViewReceipt(lastWebhookResult.payment)}
                type="button"
                className="px-3 py-1.5 font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Ver Comprobante Digital</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmed Payments Table with Receipts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900">
              Historial de Pagos y Comprobantes Acreditados
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Cada depósito cuenta con comprobante digital foliado con código de validación.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchPay}
              onChange={(e) => setSearchPay(e.target.value)}
              placeholder="Buscar recibo o alumno..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Folio Recibo</th>
                <th className="py-3 px-4">Alumno</th>
                <th className="py-3 px-4">Método / Canal</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No hay transacciones registradas.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {p.receiptNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{p.studentName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.referenceCode}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                        {p.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-emerald-800 tabular-nums">
                      ${p.amount.toLocaleString('es-MX')} MXN
                    </td>

                    <td className="py-3 px-4 text-slate-500 tabular-nums">{p.date}</td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewReceipt(p)}
                        type="button"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Ver Recibo</span>
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
  );
};
