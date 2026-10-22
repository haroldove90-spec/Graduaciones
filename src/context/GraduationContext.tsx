import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  GraduationEvent,
  GraduateStudent,
  PaymentRecord,
  PaymentReminder,
  WebhookLog,
  PaymentMethod,
} from '../types';
import {
  INITIAL_EVENT,
  INITIAL_STUDENTS,
  INITIAL_PAYMENTS,
  INITIAL_REMINDERS,
} from '../data/initialData';

interface GraduationContextType {
  event: GraduationEvent;
  students: GraduateStudent[];
  payments: PaymentRecord[];
  reminders: PaymentReminder[];
  webhookLogs: WebhookLog[];
  isSampleDataCleared: boolean;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  // Actions
  updateEvent: (updated: Partial<GraduationEvent>) => void;
  createEvent: (newEvent: Omit<GraduationEvent, 'id'>) => void;
  addStudent: (student: Omit<GraduateStudent, 'id' | 'totalDebt' | 'balanceRemaining' | 'percentPaid' | 'status' | 'monthsWithoutPayment'>) => void;
  updateStudentExtraTickets: (studentId: string, count: number) => void;
  registerFlexiblePayment: (
    studentId: string,
    amount: number,
    method: PaymentMethod,
    referenceCode?: string,
    notes?: string
  ) => PaymentRecord;
  sendReminder: (
    studentId: string,
    channel: 'whatsapp' | 'email',
    customMessage?: string
  ) => PaymentReminder;
  simulateWebhookPayment: (
    studentId: string,
    amount: number,
    gateway: 'mercadopago' | 'oxxopay' | 'stripe'
  ) => { payment: PaymentRecord; log: WebhookLog };
  releaseEventLogistics: () => boolean;
  clearAllSampleData: () => void;
  restoreSampleData: () => void;
  // Metrics
  totalAuditedLiquidationPercent: number;
  totalCollected: number;
  totalPending: number;
  totalExpectedRevenue: number;
  studentsLiquidatedCount: number;
  studentsInactiveCount: number;
  daysUntilDeadline: number;
  daysUntilEvent: number;
  isPastDeadline: boolean;
}

const GraduationContext = createContext<GraduationContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENT: 'graduaciones_event_v1',
  STUDENTS: 'graduaciones_students_v1',
  PAYMENTS: 'graduaciones_payments_v1',
  REMINDERS: 'graduaciones_reminders_v1',
  WEBHOOKS: 'graduaciones_webhooks_v1',
  SAMPLE_CLEARED: 'graduaciones_sample_data_cleared',
  SELECTED_STUDENT: 'graduaciones_selected_student',
};

export const GraduationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSampleDataCleared, setIsSampleDataCleared] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SAMPLE_CLEARED) === 'true';
  });

  const [event, setEvent] = useState<GraduationEvent>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EVENT;
  });

  const [students, setStudents] = useState<GraduateStudent[]>(() => {
    const isCleared = localStorage.getItem(STORAGE_KEYS.SAMPLE_CLEARED) === 'true';
    if (isCleared) {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return [];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_STUDENTS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const isCleared = localStorage.getItem(STORAGE_KEYS.SAMPLE_CLEARED) === 'true';
    if (isCleared) {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return [];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PAYMENTS;
  });

  const [reminders, setReminders] = useState<PaymentReminder[]>(() => {
    const isCleared = localStorage.getItem(STORAGE_KEYS.SAMPLE_CLEARED) === 'true';
    if (isCleared) return [];
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_REMINDERS;
  });

  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEBHOOKS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_STUDENT);
    if (saved) return saved;
    return students[0]?.id || 'grad-01';
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENT, JSON.stringify(event));
  }, [event]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEBHOOKS, JSON.stringify(webhookLogs));
  }, [webhookLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_STUDENT, selectedStudentId);
  }, [selectedStudentId]);

  // Recalculate metrics
  const totalExpectedRevenue = students.reduce((acc, s) => acc + s.totalDebt, 0);
  const totalCollected = students.reduce((acc, s) => acc + s.totalPaid, 0);
  const totalPending = students.reduce((acc, s) => acc + s.balanceRemaining, 0);
  const studentsLiquidatedCount = students.filter((s) => s.status === 'liquidated' || s.balanceRemaining <= 0).length;
  const studentsInactiveCount = students.filter((s) => s.status === 'inactive' || s.monthsWithoutPayment >= 2).length;
  const totalAuditedLiquidationPercent =
    students.length > 0
      ? Math.round((studentsLiquidatedCount / students.length) * 100)
      : 100;

  // Deadline calculation
  const now = new Date();
  const deadlineDate = new Date(event.liquidationDeadlineDate + 'T23:59:59');
  const eventDateObj = new Date(event.eventDate + 'T23:59:59');

  const diffTimeDeadline = deadlineDate.getTime() - now.getTime();
  const daysUntilDeadline = Math.max(0, Math.ceil(diffTimeDeadline / (1000 * 60 * 60 * 24)));
  const isPastDeadline = diffTimeDeadline < 0;

  const diffTimeEvent = eventDateObj.getTime() - now.getTime();
  const daysUntilEvent = Math.max(0, Math.ceil(diffTimeEvent / (1000 * 60 * 60 * 24)));

  // Actions
  const updateEvent = (updated: Partial<GraduationEvent>) => {
    setEvent((prev) => {
      const next = { ...prev, ...updated };
      // If eventDate changed, strictly recalculate deadline to 3 weeks before (21 days)
      if (updated.eventDate && !updated.liquidationDeadlineDate) {
        const d = new Date(updated.eventDate);
        d.setDate(d.getDate() - 21);
        next.liquidationDeadlineDate = d.toISOString().split('T')[0];
      }
      return next;
    });
  };

  const createEvent = (newEventData: Omit<GraduationEvent, 'id'>) => {
    const id = 'ev-' + Date.now();
    // Auto calculate 3 weeks before if not provided
    let deadline = newEventData.liquidationDeadlineDate;
    if (!deadline && newEventData.eventDate) {
      const d = new Date(newEventData.eventDate);
      d.setDate(d.getDate() - 21);
      deadline = d.toISOString().split('T')[0];
    }
    const created: GraduationEvent = {
      ...newEventData,
      id,
      liquidationDeadlineDate: deadline,
    };
    setEvent(created);
  };

  const updateStudentExtraTickets = (studentId: string, count: number) => {
    const cleanCount = Math.max(0, count);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newTotalDebt = s.basePackageCost + cleanCount * event.extraTicketPrice;
        const newBalance = Math.max(0, newTotalDebt - s.totalPaid);
        const percent = Math.min(100, Math.round((s.totalPaid / newTotalDebt) * 100));
        let newStatus: GraduateStudent['status'] = s.status;
        if (newBalance <= 0) {
          newStatus = 'liquidated';
        } else if (s.monthsWithoutPayment >= 3) {
          newStatus = 'inactive';
        } else if (s.monthsWithoutPayment >= 2) {
          newStatus = 'warning';
        } else {
          newStatus = 'on_track';
        }

        return {
          ...s,
          extraTicketsCount: cleanCount,
          totalDebt: newTotalDebt,
          balanceRemaining: newBalance,
          percentPaid: percent,
          status: newStatus,
        };
      })
    );
  };

  const registerFlexiblePayment = (
    studentId: string,
    amount: number,
    method: PaymentMethod,
    referenceCode?: string,
    notes?: string
  ): PaymentRecord => {
    const student = students.find((s) => s.id === studentId);
    if (!student) throw new Error('Graduado no encontrado');

    const cleanAmount = Math.max(1, Math.min(amount, student.balanceRemaining > 0 ? student.balanceRemaining : amount));
    const nowStr = new Date().toISOString().split('T')[0];
    const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const refCode = referenceCode || `${method.toUpperCase()}-${Date.now().toString().slice(-8)}`;

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      graduateId: studentId,
      studentName: student.fullName,
      amount: cleanAmount,
      date: nowStr,
      paymentMethod: method,
      referenceCode: refCode,
      receiptNumber: receiptNum,
      status: 'confirmed',
      notes: notes || `Abono flexible registrado vía ${method}`,
    };

    // Update student balances
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newPaid = s.totalPaid + cleanAmount;
        const newBalance = Math.max(0, s.totalDebt - newPaid);
        const percent = Math.min(100, Math.round((newPaid / s.totalDebt) * 100));
        const status: GraduateStudent['status'] = newBalance <= 0 ? 'liquidated' : 'on_track';

        return {
          ...s,
          totalPaid: newPaid,
          balanceRemaining: newBalance,
          percentPaid: percent,
          status,
          lastPaymentDate: nowStr,
          monthsWithoutPayment: 0,
        };
      })
    );

    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  };

  const addStudent = (studentData: Omit<GraduateStudent, 'id' | 'totalDebt' | 'balanceRemaining' | 'percentPaid' | 'status' | 'monthsWithoutPayment'>) => {
    const id = 'grad-' + Date.now();
    const totalDebt = studentData.basePackageCost + studentData.extraTicketsCount * event.extraTicketPrice;
    const balanceRemaining = Math.max(0, totalDebt - studentData.totalPaid);
    const percentPaid = Math.min(100, Math.round((studentData.totalPaid / totalDebt) * 100));
    const status: GraduateStudent['status'] = balanceRemaining <= 0 ? 'liquidated' : 'on_track';

    const newStudent: GraduateStudent = {
      ...studentData,
      id,
      totalDebt,
      balanceRemaining,
      percentPaid,
      status,
      monthsWithoutPayment: 0,
    };

    setStudents((prev) => [newStudent, ...prev]);
  };

  const sendReminder = (
    studentId: string,
    channel: 'whatsapp' | 'email',
    customMessage?: string
  ): PaymentReminder => {
    const student = students.find((s) => s.id === studentId);
    if (!student) throw new Error('Graduado no encontrado');

    const defaultMsg =
      channel === 'whatsapp'
        ? `¡Hola ${student.fullName.split(' ')[0]}! Te saludamos de la Coordinación de Graduaciones (${event.school}). Tu saldo pendiente es de $${student.balanceRemaining.toLocaleString('es-MX')} MXN. Recuerda que la fecha límite estricta es el ${event.liquidationDeadlineDate}. Puedes realizar tus abonos flexibles aquí: https://graduaciones.app/portal?id=${student.studentId}`
        : `Estimado/a ${student.fullName}, le recordamos el estado de cuenta para su ceremonia de graduación en ${event.school}. Su saldo pendiente actual es de $${student.balanceRemaining.toLocaleString('es-MX')} MXN.`;

    const reminder: PaymentReminder = {
      id: 'rem-' + Date.now(),
      graduateId: studentId,
      studentName: student.fullName,
      channel,
      message: customMessage || defaultMsg,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'delivered',
    };

    setReminders((prev) => [reminder, ...prev]);
    return reminder;
  };

  const simulateWebhookPayment = (
    studentId: string,
    amount: number,
    gateway: 'mercadopago' | 'oxxopay' | 'stripe'
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) throw new Error('Graduado no encontrado');

    const gatewayMethodMap: Record<string, PaymentMethod> = {
      mercadopago: 'mercadopago',
      oxxopay: 'oxxo',
      stripe: 'card',
    };

    const method = gatewayMethodMap[gateway] || 'mercadopago';
    const reference = `${gateway.toUpperCase()}-WHK-${Date.now().toString().slice(-8)}`;

    const payment = registerFlexiblePayment(
      studentId,
      amount,
      method,
      reference,
      `Acreditación automática por Webhook de ${gateway.toUpperCase()}`
    );

    const log: WebhookLog = {
      id: 'whk-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      gateway,
      eventType: 'payment.received.instant_notification',
      amount,
      referenceCode: reference,
      studentName: student.fullName,
      status: 'processed',
    };

    setWebhookLogs((prev) => [log, ...prev]);

    return { payment, log };
  };

  const releaseEventLogistics = (): boolean => {
    if (totalAuditedLiquidationPercent === 100) {
      setEvent((prev) => ({
        ...prev,
        status: 'released',
        isReleasedForLogistics: true,
      }));
      return true;
    }
    return false;
  };

  // Full clean sample data function requested by user:
  // "Activa botón para poder borrar datos de muestra del todo el sistema, activa la función para que el navegador no muestre los datos de muestra nuevamente y se puedan borrar los registros en supabase cuando se configure."
  const clearAllSampleData = () => {
    localStorage.setItem(STORAGE_KEYS.SAMPLE_CLEARED, 'true');
    setIsSampleDataCleared(true);
    setStudents([]);
    setPayments([]);
    setReminders([]);
    setWebhookLogs([]);
    setSelectedStudentId('');
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.WEBHOOKS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_STUDENT);
  };

  const restoreSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.SAMPLE_CLEARED);
    setIsSampleDataCleared(false);
    setEvent(INITIAL_EVENT);
    setStudents(INITIAL_STUDENTS);
    setPayments(INITIAL_PAYMENTS);
    setReminders(INITIAL_REMINDERS);
    setSelectedStudentId(INITIAL_STUDENTS[0].id);
  };

  return (
    <GraduationContext.Provider
      value={{
        event,
        students,
        payments,
        reminders,
        webhookLogs,
        isSampleDataCleared,
        selectedStudentId,
        setSelectedStudentId,
        updateEvent,
        createEvent,
        addStudent,
        updateStudentExtraTickets,
        registerFlexiblePayment,
        sendReminder,
        simulateWebhookPayment,
        releaseEventLogistics,
        clearAllSampleData,
        restoreSampleData,
        totalAuditedLiquidationPercent,
        totalCollected,
        totalPending,
        totalExpectedRevenue,
        studentsLiquidatedCount,
        studentsInactiveCount,
        daysUntilDeadline,
        daysUntilEvent,
        isPastDeadline,
      }}
    >
      {children}
    </GraduationContext.Provider>
  );
};

export const useGraduation = () => {
  const context = useContext(GraduationContext);
  if (!context) {
    throw new Error('useGraduation must be used within a GraduationProvider');
  }
  return context;
};
