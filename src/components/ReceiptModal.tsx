import React from 'react';
import { PaymentRecord } from '../types';
import { BrandLogo } from './BrandLogo';
import { X, Printer, Download, CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  payment: PaymentRecord;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 text-slate-900 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Controls Bar (hidden during print) */}
        <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs font-bold text-slate-600">
            Comprobante Oficial de Pago Digital
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs" id="printable-receipt">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <BrandLogo size="md" showText={true} variant="dark" />
              <div className="text-[11px] text-slate-500 mt-2">
                Coordinación y Logística de Eventos Académicos
              </div>
              <div className="text-[10px] text-slate-400">RFC: PRO-GRAD-260301-8X2</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                RECIBO DIGITAL
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
                {payment.receiptNumber}
              </span>
              <div className="text-[11px] text-slate-500 mt-1">Fecha: {payment.date}</div>
            </div>
          </div>

          {/* Student & Event Information */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Alumno / Graduado
              </span>
              <div className="font-bold text-slate-900 text-xs mt-0.5">
                {payment.studentName}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                ID Alumno: {payment.graduateId}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Canal de Recepción
              </span>
              <div className="font-bold text-slate-900 text-xs mt-0.5 uppercase">
                {payment.paymentMethod}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Ref: {payment.referenceCode}
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-2">Concepto</th>
                <th className="pb-2 text-right">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3">
                  <div className="font-bold text-slate-900">
                    Abono Flexible para Paquete de Graduación
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {payment.notes || 'Acreditación bancaria confirmada'}
                  </div>
                </td>
                <td className="py-3 text-right font-black text-slate-900 tabular-nums text-sm">
                  ${payment.amount.toLocaleString('es-MX')} MXN
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total Highlight */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <span className="font-bold text-amber-950 text-xs">Total Acreditado:</span>
            <span className="text-xl font-black text-amber-950 tabular-nums">
              ${payment.amount.toLocaleString('es-MX')} MXN
            </span>
          </div>

          {/* QR Code and Digital Seal */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Stylized QR placeholder */}
              <div className="p-2 rounded-xl bg-white border border-slate-300 shadow-2xs">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Autenticidad Verificada</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                  HASH: 8F2A-99B1-40E7-F291
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono">
                Emitido por Graduaciones Pro
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                Depósito Validado
              </div>
            </div>
          </div>
        </div>

        {/* Modal Close CTA in Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-5 py-2 font-bold text-xs bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
