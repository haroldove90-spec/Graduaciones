import React, { useState } from 'react';
import { Role, PaymentRecord } from './types';
import { GraduationProvider, useGraduation } from './context/GraduationContext';
import { RoleSelector } from './components/RoleSelector';
import { UnifiedHeader } from './components/UnifiedHeader';
import { BottomNav } from './components/BottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';
import { EventManager } from './components/admin/EventManager';
import { GraduatesCRM } from './components/admin/GraduatesCRM';
import { AutomationAlerts } from './components/admin/AutomationAlerts';
import { FinanceWebhooks } from './components/admin/FinanceWebhooks';
import { EventAuditModal } from './components/admin/EventAuditModal';
import { StudentPortal } from './components/student/StudentPortal';
import { ReceiptModal } from './components/ReceiptModal';
import { DataManagementModal } from './components/DataManagementModal';

function DashboardContent() {
  const [currentRole, setCurrentRole] = useState<Role | null>(() => {
    // Check if user previously picked a role in session
    const saved = sessionStorage.getItem('graduaciones_active_role');
    return (saved as Role) || null;
  });

  const [activeModule, setActiveModule] = useState<string>('events');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [viewingReceipt, setViewingReceipt] = useState<PaymentRecord | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);

  const { students, selectedStudentId, studentsInactiveCount } = useGraduation();

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  const handleSelectRole = (role: Role) => {
    setCurrentRole(role);
    sessionStorage.setItem('graduaciones_active_role', role);

    // Set default initial module according to role
    if (role === 'admin') setActiveModule('events');
    else if (role === 'student') setActiveModule('account');
    else if (role === 'coordinator') setActiveModule('events');
    else if (role === 'auditor') setActiveModule('finances');
  };

  const handleLogout = () => {
    setCurrentRole(null);
    sessionStorage.removeItem('graduaciones_active_role');
  };

  const handleSwitchRole = (role: Role) => {
    handleSelectRole(role);
  };

  // If no active role: Display clean initial Role Selector screen (2 col mobile / 4 col desktop, no header, no descriptions)
  if (!currentRole) {
    return <RoleSelector onSelectRole={handleSelectRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Cabecera Institucional Unificada */}
      <UnifiedHeader
        currentRole={currentRole}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onOpenDataManagement={() => setIsDataModalOpen(true)}
        studentName={currentStudent?.fullName}
      />

      {/* Main Container with Desktop Sidebar and Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Menú Lateral Desplegable en Escritorio */}
        <DesktopSidebar
          currentRole={currentRole}
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto max-w-full">
          {/* Admin / Organizer Views */}
          {currentRole === 'admin' && (
            <>
              {activeModule === 'events' && <EventManager />}
              {activeModule === 'graduates' && (
                <GraduatesCRM onViewReceipt={(pay) => setViewingReceipt(pay)} />
              )}
              {activeModule === 'automation' && <AutomationAlerts />}
              {activeModule === 'finances' && (
                <FinanceWebhooks onViewReceipt={(pay) => setViewingReceipt(pay)} />
              )}
              {activeModule === 'audit' && <EventAuditModal />}
              {!['events', 'graduates', 'automation', 'finances', 'audit'].includes(activeModule) && (
                <EventManager />
              )}
            </>
          )}

          {/* Student / Graduado Views */}
          {currentRole === 'student' && (
            <StudentPortal
              activeTab={
                ['account', 'tickets', 'checkout', 'receipts'].includes(activeModule)
                  ? activeModule
                  : 'account'
              }
              onSelectTab={setActiveModule}
              onViewReceipt={(pay) => setViewingReceipt(pay)}
            />
          )}

          {/* Coordinator Views */}
          {currentRole === 'coordinator' && (
            <>
              {activeModule === 'events' && <EventManager />}
              {activeModule === 'graduates' && (
                <GraduatesCRM onViewReceipt={(pay) => setViewingReceipt(pay)} />
              )}
              {activeModule === 'automation' && <AutomationAlerts />}
              {activeModule === 'audit' && <EventAuditModal />}
              {!['events', 'graduates', 'automation', 'audit'].includes(activeModule) && (
                <EventManager />
              )}
            </>
          )}

          {/* Auditor Views */}
          {currentRole === 'auditor' && (
            <>
              {activeModule === 'finances' && (
                <FinanceWebhooks onViewReceipt={(pay) => setViewingReceipt(pay)} />
              )}
              {activeModule === 'graduates' && (
                <GraduatesCRM onViewReceipt={(pay) => setViewingReceipt(pay)} />
              )}
              {activeModule === 'events' && <EventManager />}
              {activeModule === 'audit' && <EventAuditModal />}
              {!['finances', 'graduates', 'events', 'audit'].includes(activeModule) && (
                <FinanceWebhooks onViewReceipt={(pay) => setViewingReceipt(pay)} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomNav
        currentRole={currentRole}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        inactiveCount={studentsInactiveCount}
      />

      {/* Receipt Modal */}
      {viewingReceipt && (
        <ReceiptModal
          payment={viewingReceipt}
          onClose={() => setViewingReceipt(null)}
        />
      )}

      {/* Data Management & Supabase Modal */}
      {isDataModalOpen && (
        <DataManagementModal onClose={() => setIsDataModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GraduationProvider>
      <DashboardContent />
    </GraduationProvider>
  );
}
