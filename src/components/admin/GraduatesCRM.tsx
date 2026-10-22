import React, { useState } from 'react';
import { useGraduation } from '../../context/GraduationContext';
import { GraduateStudent, PaymentMethod, PaymentRecord } from '../../types';
import {
  Users,
  Search,
  Filter,
  DollarSign,
  Ticket,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Receipt,
  Eye,
  Send,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GraduatesCRMProps {
  onViewReceipt?: (payment: PaymentRecord) => void;
}

export const GraduatesCRM: React.FC<GraduatesCRMProps> = ({ onViewReceipt }) => {
  const {
    students,
    event,
    updateStudentExtraTickets,
    registerFlexiblePayment,
    addStudent,
    totalCollected,
    totalPending,
    totalExpectedRevenue,
    studentsLiquidatedCount,
    studentsInactiveCount,
  } = useGraduation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'liquidated' | 'on_track' | 'warning' | 'inactive'>('all');
  
  // Abono Modal
  const [selectedForPayment, setSelectedForPayment] = useState<GraduateStudent | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(1500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<PaymentRecord | null>(null);

  // New Student Modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    extraTicketsCount: 0,
    basePackageCost: event.packageCost,
    totalPaid: 0,
  });

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'liquidated') return s.status === 'liquidated' || s.balanceRemaining <= 0;
    if (statusFilter === 'inactive') return s.status === 'inactive' || s.monthsWithoutPayment >= 2;
    return s.status === statusFilter;
  });

  const handleOpenPayment = (student: GraduateStudent) => {
    setSelectedForPayment(student);
    setPaymentAmount(student.balanceRemaining > 0 ? Math.min(2000, student.balanceRemaining) : 1000);
    setPaymentNotes(`Abono flexible voluntario - ${event.school}`);
    setPaymentSuccess(null);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForPayment) return;

    try {
      const record = registerFlexiblePayment(
        selectedForPayment.id,
        paymentAmount,
        paymentMethod,
        undefined,
        paymentNotes
      );
      setPaymentSuccess(record);

      if (selectedForPayment.balanceRemaining - paymentAmount <= 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      // update local reference
      const updated = students.find((s) => s.id === selectedForPayment.id);
      if (updated) setSelectedForPayment(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      eventId: event.id,
      fullName: newStudentData.fullName,
      studentId: newStudentData.studentId || `UB-${Date.now().toString().slice(-4)}`,
      email: newStudentData.email,
      phone: newStudentData.phone,
      extraTicketsCount: Number(newStudentData.extraTicketsCount) || 0,
      basePackageCost: Number(newStudentData.basePackageCost) || event.packageCost,
      totalPaid: Number(newStudentData.totalPaid) || 0,
      lastPaymentDate: newStudentData.totalPaid > 0 ? new Date().toISOString().split('T')[0] : null,
    });
    setShowAddStudentModal(false);
    setNewStudentData({
      fullName: '',
      studentId: '',
      email: '',
      phone: '',
      extraTicketsCount: 0,
      basePackageCost: event.packageCost,
      totalPaid: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Padrón CRM & Seguimiento de Graduados
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Control de los {students.length} alumnos inscritos, registro de abonos libres y estado de cuenta individual.
          </p>
        </div>

        <button
          onClick={() => setShowAddStudentModal(true)}
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Inscribir Graduado</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Recaudado Total</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-extrabold text-emerald-800 tabular-nums">
            ${totalCollected.toLocaleString('es-MX')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Meta: ${totalExpectedRevenue.toLocaleString('es-MX')} MXN
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Saldo por Cobrar</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-extrabold text-amber-900 tabular-nums">
            ${totalPending.toLocaleString('es-MX')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Adeudo acumulado flexible</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">100% Liquidados</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            {studentsLiquidatedCount} <span className="text-xs text-slate-600 font-normal">/ {students.length}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {students.length > 0 ? Math.round((studentsLiquidatedCount / students.length) * 100) : 0}% al día
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Inactivos / Alerta</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-extrabold text-rose-800 tabular-nums">
            {studentsInactiveCount} <span className="text-xs text-slate-600 font-normal">Alumnos</span>
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            Meses sin registrar abono
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, matrícula o correo del alumno..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-900 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter('liquidated')}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'liquidated'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Liquidados ({studentsLiquidatedCount})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'inactive'
                ? 'bg-rose-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            En Alerta ({studentsInactiveCount})
          </button>
        </div>
      </div>

      {/* Main CRM: Responsive View (Cards on mobile, Table on desktop) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Mobile Cards (sm:hidden) */}
        <div className="sm:hidden divide-y divide-slate-100">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="font-semibold text-slate-600 text-xs">No se encontraron graduados</p>
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isFullyPaid = student.balanceRemaining <= 0;
              const isWarning = student.monthsWithoutPayment >= 2;
              return (
                <div key={student.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {student.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {student.studentId}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isFullyPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : isWarning
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isFullyPaid ? 'Liquidado' : `${student.percentPaid}%`}
                    </span>
                  </div>

                  {/* Financials & Boletos */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Costo Total</span>
                      <strong className="text-slate-900 tabular-nums">
                        ${student.totalDebt.toLocaleString('es-MX')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Abonado</span>
                      <strong className="text-emerald-800 tabular-nums">
                        ${student.totalPaid.toLocaleString('es-MX')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Saldo</span>
                      <strong className="text-amber-900 tabular-nums">
                        ${student.balanceRemaining.toLocaleString('es-MX')}
                      </strong>
                    </div>
                  </div>

                  {/* Extra Tickets & Action row */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[11px] text-slate-500 font-medium">Boletos:</span>
                      <div className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200">
                        <button
                          onClick={() =>
                            updateStudentExtraTickets(
                              student.id,
                              Math.max(0, student.extraTicketsCount - 1)
                            )
                          }
                          type="button"
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold tabular-nums text-slate-900 text-xs">
                          {student.extraTicketsCount}
                        </span>
                        <button
                          onClick={() =>
                            updateStudentExtraTickets(student.id, student.extraTicketsCount + 1)
                          }
                          type="button"
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenPayment(student)}
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 shadow-2xs"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      <span>Abonar</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table (hidden sm:block) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Alumno / Matrícula</th>
                <th className="py-3 px-4">Boletos Extra</th>
                <th className="py-3 px-4 text-right">Costo Total</th>
                <th className="py-3 px-4 text-right">Abonado</th>
                <th className="py-3 px-4 text-right">Saldo Restante</th>
                <th className="py-3 px-4">Avance / Estatus</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600 text-sm">No se encontraron graduados</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {students.length === 0
                        ? 'El padrón está limpio. Registra alumnos o restaura datos de muestra.'
                        : 'Intenta con otro término de búsqueda o filtro.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isFullyPaid = student.balanceRemaining <= 0;
                  const isWarning = student.monthsWithoutPayment >= 2;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 leading-tight">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{student.studentId}</span>
                          <span>·</span>
                          <span className="truncate max-w-[150px]">{student.email}</span>
                        </div>
                      </td>

                      {/* Extra Tickets Modifier */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200/80">
                          <button
                            onClick={() =>
                              updateStudentExtraTickets(
                                student.id,
                                Math.max(0, student.extraTicketsCount - 1)
                              )
                            }
                            type="button"
                            className="w-5 h-5 flex items-center justify-center rounded bg-white text-slate-700 hover:bg-slate-200 font-bold"
                            title="Quitar 1 boleto"
                          >
                            -
                          </button>
                          <span className="px-1.5 font-bold text-slate-900 tabular-nums">
                            {student.extraTicketsCount}
                          </span>
                          <button
                            onClick={() =>
                              updateStudentExtraTickets(student.id, student.extraTicketsCount + 1)
                            }
                            type="button"
                            className="w-5 h-5 flex items-center justify-center rounded bg-white text-slate-700 hover:bg-slate-200 font-bold"
                            title="Sumar 1 boleto"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          +${(student.extraTicketsCount * event.extraTicketPrice).toLocaleString('es-MX')}
                        </div>
                      </td>

                      {/* Total Cost */}
                      <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                        ${student.totalDebt.toLocaleString('es-MX')}
                      </td>

                      {/* Total Paid */}
                      <td className="py-3 px-4 text-right font-semibold text-emerald-800 tabular-nums">
                        ${student.totalPaid.toLocaleString('es-MX')}
                      </td>

                      {/* Balance Remaining */}
                      <td className="py-3 px-4 text-right font-bold tabular-nums">
                        {isFullyPaid ? (
                          <span className="text-emerald-800 font-bold">$0 MXN</span>
                        ) : (
                          <span className="text-amber-900 font-bold">
                            ${student.balanceRemaining.toLocaleString('es-MX')}
                          </span>
                        )}
                      </td>

                      {/* Status / Progress */}
                      <td className="py-3 px-4 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span
                            className={`font-semibold ${
                              isFullyPaid
                                ? 'text-emerald-700'
                                : isWarning
                                ? 'text-rose-600'
                                : 'text-slate-700'
                            }`}
                          >
                            {isFullyPaid
                              ? 'Liquidado'
                              : isWarning
                              ? `${student.monthsWithoutPayment}m sin abono`
                              : 'Al corriente'}
                          </span>
                          <span className="font-bold tabular-nums text-slate-900">
                            {student.percentPaid}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isFullyPaid
                                ? 'bg-emerald-500'
                                : isWarning
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${student.percentPaid}%` }}
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenPayment(student)}
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-colors shadow-2xs"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Abonar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Abono Flexible */}
      {selectedForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Registrar Abono Flexible
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedForPayment.fullName}</p>
              </div>
              <button
                onClick={() => setSelectedForPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡Abono acreditado exitosamente!</span>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div>
                    Monto recibido: <strong>${paymentSuccess.amount.toLocaleString('es-MX')} MXN</strong>
                  </div>
                  <div>
                    Recibo emitido: <strong>{paymentSuccess.receiptNumber}</strong>
                  </div>
                  <div>
                    Referencia: <span className="font-mono">{paymentSuccess.referenceCode}</span>
                  </div>
                  <div>
                    Nuevo saldo pendiente:{' '}
                    <strong>
                      ${(selectedForPayment.balanceRemaining - paymentSuccess.amount <= 0
                        ? 0
                        : selectedForPayment.balanceRemaining - paymentSuccess.amount
                      ).toLocaleString('es-MX')}{' '}
                      MXN
                    </strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      if (onViewReceipt) onViewReceipt(paymentSuccess);
                      setSelectedForPayment(null);
                    }}
                    type="button"
                    className="px-3.5 py-1.5 font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Ver Recibo Digital</span>
                  </button>
                  <button
                    onClick={() => setSelectedForPayment(null)}
                    type="button"
                    className="px-3.5 py-1.5 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmPayment} className="mt-4 space-y-4 text-xs">
                {/* Account Summary mini */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500">Saldo Pendiente Actual:</span>
                    <div className="text-base font-extrabold text-amber-900 tabular-nums">
                      ${selectedForPayment.balanceRemaining.toLocaleString('es-MX')} MXN
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Abonado a la fecha:</span>
                    <div className="text-sm font-bold text-slate-800 tabular-nums">
                      ${selectedForPayment.totalPaid.toLocaleString('es-MX')} MXN
                    </div>
                  </div>
                </div>

                {/* Amount input with quick pills */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Monto a Abonar Libremente ($ MXN)
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    min={1}
                    max={selectedForPayment.balanceRemaining || 100000}
                    required
                    className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none tabular-nums text-slate-900"
                  />
                  {/* Quick abono buttons */}
                  <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[500, 1000, 2000, 3500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPaymentAmount(Math.min(amt, selectedForPayment.balanceRemaining))}
                        className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                      >
                        +${amt}
                      </button>
                    ))}
                    {selectedForPayment.balanceRemaining > 0 && (
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(selectedForPayment.balanceRemaining)}
                        className="px-2 py-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg ml-auto"
                      >
                        Liquidar Total (${selectedForPayment.balanceRemaining.toLocaleString('es-MX')})
                      </button>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Canal / Método de Pago
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none font-medium text-slate-900"
                  >
                    <option value="transfer">Transferencia SPEI / Banco</option>
                    <option value="oxxo">OXXO Pay / Tiendas de Conveniencia</option>
                    <option value="mercadopago">Mercado Pago / Billetera Digital</option>
                    <option value="card">Tarjeta Débito / Crédito (Stripe)</option>
                    <option value="seven_eleven">7-Eleven / Efectivo</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Concepto / Referencia Bancaria
                  </label>
                  <input
                    type="text"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Ej. Transferencia Banamex folio 992810"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-none text-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => setSelectedForPayment(null)}
                    type="button"
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
                  >
                    Acreditar y Emitir Recibo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Inscribir Graduado */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Inscribir Nuevo Graduado
            </h3>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nombre Completo del Alumno
                </label>
                <input
                  type="text"
                  required
                  value={newStudentData.fullName}
                  onChange={(e) => setNewStudentData({ ...newStudentData, fullName: e.target.value })}
                  placeholder="Ej. Laura Elena Romero Vargas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Matrícula</label>
                  <input
                    type="text"
                    value={newStudentData.studentId}
                    onChange={(e) => setNewStudentData({ ...newStudentData, studentId: e.target.value })}
                    placeholder="UB-CONT-31"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Teléfono Móvil (WhatsApp)</label>
                  <input
                    type="text"
                    value={newStudentData.phone}
                    onChange={(e) => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={newStudentData.email}
                  onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                  placeholder="alumno@alumnos.ub.edu.mx"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Boletos Extra</label>
                  <input
                    type="number"
                    min={0}
                    value={newStudentData.extraTicketsCount}
                    onChange={(e) => setNewStudentData({ ...newStudentData, extraTicketsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 tabular-nums font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Paquete Base ($)</label>
                  <input
                    type="number"
                    value={newStudentData.basePackageCost}
                    onChange={(e) => setNewStudentData({ ...newStudentData, basePackageCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 tabular-nums font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Abono Inicial ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={newStudentData.totalPaid}
                    onChange={(e) => setNewStudentData({ ...newStudentData, totalPaid: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 tabular-nums font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  type="button"
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Registrar en el Padrón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
