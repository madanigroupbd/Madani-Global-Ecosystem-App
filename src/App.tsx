import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, ActiveTab } from './components/common/Sidebar';
import { RoleAuthModal } from './components/common/RoleAuthModal';
import { NotificationToast, ToastAlert } from './components/common/NotificationToast';

import { FintechHub } from './components/fintech/FintechHub';
import { WelfareHub } from './components/welfare/WelfareHub';
import { CommerceHub } from './components/commerce/CommerceHub';
import { HealthEduHub } from './components/health_edu/HealthEduHub';
import { LawCyberHub } from './components/law_cyber/LawCyberHub';
import { SRSAppHub } from './components/srs_app/SRSAppHub';

import {
  UserRole,
  AuthorityDivision,
  MFSTransaction,
  MemberAccount,
  LedgerEntry,
  CommissionPayout,
  EmergencyLoan,
  ConstructionProject,
  LegalAidCase,
  CyberReport,
  BiometricAuthLog
} from './types';

import {
  BANGLADESH_DISTRICTS,
  INITIAL_MFS_TRANSACTIONS,
  INITIAL_COOP_ACCOUNTS,
  INITIAL_COOP_LEDGER,
  INITIAL_COMMISSIONS,
  INITIAL_EMERGENCY_LOANS,
  INITIAL_CONSTRUCTION_PROJECTS,
  INITIAL_DISTRICT_SERVICES,
  INITIAL_VEHICLES,
  INITIAL_FACTORY_PRODUCTS,
  INITIAL_HEALTH_TOURISM,
  INITIAL_EDUCATIONAL_RESOURCES,
  INITIAL_LEGAL_AID_CASES,
  INITIAL_CYBER_REPORTS,
  INITIAL_IMEI_DATABASE,
  INITIAL_CDR_LOGS,
  INITIAL_MISSING_PERSONS,
  INITIAL_MOUJA_PLOTS,
  INITIAL_VOTERS,
  GOV_PORTAL_LINKS,
  INITIAL_BIOMETRIC_AUTH_LOGS
} from './data/mockData';

export default function App() {
  // Navigation & Access Control State
  const [activeTab, setActiveTab] = useState<ActiveTab>('fintech');
  const [currentRole, setCurrentRole] = useState<UserRole>('GENERAL_USER');
  const [authorityDivision, setAuthorityDivision] = useState<AuthorityDivision | undefined>(undefined);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Modals & Overlay state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // System Notifications
  const [notifications, setNotifications] = useState<ToastAlert[]>([
    {
      id: 'notif-1',
      title: 'Ecosystem Online',
      message: 'Madani Global Ecosystem connected with 0% charge MFS and zero-interest welfare ledger.',
      type: 'success',
      timestamp: '10:54 AM'
    }
  ]);

  // Data Stores
  const [mfsTransactions, setMfsTransactions] = useState<MFSTransaction[]>(INITIAL_MFS_TRANSACTIONS);
  const [coopAccounts, setCoopAccounts] = useState<MemberAccount[]>(INITIAL_COOP_ACCOUNTS);
  const [coopLedger, setCoopLedger] = useState<LedgerEntry[]>(INITIAL_COOP_LEDGER);
  const [commissions, setCommissions] = useState<CommissionPayout[]>(INITIAL_COMMISSIONS);
  const [loans, setLoans] = useState<EmergencyLoan[]>(INITIAL_EMERGENCY_LOANS);
  const [projects, setProjects] = useState<ConstructionProject[]>(INITIAL_CONSTRUCTION_PROJECTS);
  const [legalCases, setLegalCases] = useState<LegalAidCase[]>(INITIAL_LEGAL_AID_CASES);
  const [cyberReports, setCyberReports] = useState<CyberReport[]>(INITIAL_CYBER_REPORTS);
  const [authLogs, setAuthLogs] = useState<BiometricAuthLog[]>(INITIAL_BIOMETRIC_AUTH_LOGS);

  const handleLogAuthAttempt = (log: BiometricAuthLog) => {
    setAuthLogs((prev) => [log, ...prev]);
  };

  // Handler: Role Authentication
  const handleAuthenticateRole = (role: UserRole, division?: AuthorityDivision) => {
    setCurrentRole(role);
    setAuthorityDivision(division);

    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: 'Access Role Updated',
      message: role === 'LAW_ENFORCEMENT_OFFICER'
        ? `Encrypted Law Enforcement Authority Granted for ${division || 'CID'}`
        : role === 'COOP_ADMIN'
        ? 'Cooperative Admin Control Panel Unlocked'
        : 'Switched to Public User Interface',
      type: 'info',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotifications((prev) => [alert, ...prev]);
  };

  // Handlers for Data Updates
  const handleNewMFSTransaction = (trx: MFSTransaction) => {
    setMfsTransactions((prev) => [trx, ...prev]);
    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: `${trx.provider} Transaction Successful`,
      message: `Transferred ৳${trx.amount.toLocaleString()} BDT to ${trx.receiverPhone}. Service Charge: 0 BDT. TRX ID: ${trx.trxId}`,
      type: 'success',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [alert, ...prev]);
  };

  const handleAddLedgerEntry = (entry: LedgerEntry) => {
    setCoopLedger((prev) => [entry, ...prev]);
    // update account
    setCoopAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountNo === entry.accountNo) {
          const isDeposit = entry.type === 'DEPOSIT';
          return {
            ...acc,
            totalSavings: isDeposit ? acc.totalSavings + entry.amount : acc.totalSavings - entry.amount,
            totalDeposits: isDeposit ? acc.totalDeposits + entry.amount : acc.totalDeposits,
            totalWithdrawals: !isDeposit ? acc.totalWithdrawals + entry.amount : acc.totalWithdrawals,
            lastTransactionDate: entry.date
          };
        }
        return acc;
      })
    );

    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: 'Cooperative Ledger Entry Audited',
      message: `Recorded ${entry.type} of ৳${entry.amount.toLocaleString()} BDT for Account ${entry.accountNo}.`,
      type: 'success',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [alert, ...prev]);
  };

  const handleNewPayoutRequest = (payout: CommissionPayout) => {
    setCommissions((prev) => [payout, ...prev]);
    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: 'Commission Payout Request Filed',
      message: `Claim for ৳${payout.commissionAmount.toLocaleString()} BDT submitted for ${payout.entrepreneurName}.`,
      type: 'info',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [alert, ...prev]);
  };

  const handleApplyLoan = (loan: EmergencyLoan) => {
    setLoans((prev) => [loan, ...prev]);
    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: 'Zero-Interest Loan Application Submitted',
      message: `Emergency request for ৳${loan.amountRequested.toLocaleString()} BDT filed for ${loan.applicantName} (${loan.district}).`,
      type: 'success',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [alert, ...prev]);
  };

  const handleLoanRepayment = (loanId: string, amount: number, paymentMethod: string, notes?: string) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    const newRepaidAmount = (targetLoan.repaidAmount || 0) + amount;

    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          return {
            ...l,
            repaidAmount: newRepaidAmount
          };
        }
        return l;
      })
    );

    // Automatically post a ledger entry to Cooperative Passbook Ledger
    const ledgerEntry: LedgerEntry = {
      id: `led-repay-${Date.now()}`,
      accountNo: coopAccounts[0]?.accountNo || 'MDN-COOP-8801',
      type: 'DEPOSIT',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      note: `Loan Repayment (${targetLoan.purpose}) via ${paymentMethod}. ${notes || ''}`,
      approvedBy: `Automated Gateway (${paymentMethod})`
    };
    handleAddLedgerEntry(ledgerEntry);

    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: 'Zero-Profit Loan Repayment Received',
      message: `Received ৳${amount.toLocaleString()} BDT instalment from ${targetLoan.applicantName} (${targetLoan.district}) via ${paymentMethod}. Ledger updated.`,
      type: 'success',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [alert, ...prev]);
  };

  const handleNewConstructionProject = (project: ConstructionProject) => {
    setProjects((prev) => [project, ...prev]);
    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: 'Housing Project Launched',
      message: `Allocated ${project.rodAllocatedKg}kg steel rod & ${project.cementAllocatedBags} bags cement for ${project.title}.`,
      type: 'success',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [alert, ...prev]);
  };

  const handleFileLegalCase = (c: LegalAidCase) => {
    setLegalCases((prev) => [c, ...prev]);
    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: 'Free Legal Protection Case Filed',
      message: `Assigned Advocate Barrister to victim ${c.victimName} (${c.district}).`,
      type: 'warning',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [alert, ...prev]);
  };

  const handleFileCyberReport = (r: CyberReport) => {
    setCyberReports((prev) => [r, ...prev]);
    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title: 'Cyber Incident Evidence Vault Locked',
      message: `Code ${r.reportCode} encrypted and transmitted to Law Enforcement Cyber Cell.`,
      type: 'warning',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications((prev) => [alert, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      
      {/* Header */}
      <Header
        currentRole={currentRole}
        authorityDivision={authorityDivision}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        notificationCount={notifications.length}
        onOpenNotifications={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
        districts={BANGLADESH_DISTRICTS}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isAuthorityUnlocked={currentRole === 'LAW_ENFORCEMENT_OFFICER'}
        />

        {/* Content Canvas Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          
          {activeTab === 'fintech' && (
            <FintechHub
              mfsTransactions={mfsTransactions}
              onNewMFSTransaction={handleNewMFSTransaction}
              coopAccounts={coopAccounts}
              coopLedger={coopLedger}
              onAddLedgerEntry={handleAddLedgerEntry}
              commissions={commissions}
              onNewPayoutRequest={handleNewPayoutRequest}
              isAdminMode={currentRole === 'COOP_ADMIN'}
              loans={loans}
              onRepayLoan={handleLoanRepayment}
            />
          )}

          {activeTab === 'welfare' && (
            <WelfareHub
              loans={loans}
              onApplyLoan={handleApplyLoan}
              projects={projects}
              onNewProject={handleNewConstructionProject}
              districtServices={INITIAL_DISTRICT_SERVICES}
              selectedDistrict={selectedDistrict}
              onDistrictSelect={setSelectedDistrict}
              districtsList={BANGLADESH_DISTRICTS}
            />
          )}

          {activeTab === 'commerce' && (
            <CommerceHub
              vehicles={INITIAL_VEHICLES}
              factoryProducts={INITIAL_FACTORY_PRODUCTS}
            />
          )}

          {activeTab === 'health_edu' && (
            <HealthEduHub
              destinations={INITIAL_HEALTH_TOURISM}
              resources={INITIAL_EDUCATIONAL_RESOURCES}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === 'law_cyber' && (
            <LawCyberHub
              cases={legalCases}
              onFileNewCase={handleFileLegalCase}
              cyberReports={cyberReports}
              onFileCyberReport={handleFileCyberReport}
              isLawUnlocked={currentRole === 'LAW_ENFORCEMENT_OFFICER'}
              authorityDivision={authorityDivision}
              onUnlockLawCellRequest={() => setIsAuthModalOpen(true)}
              imeiDatabase={INITIAL_IMEI_DATABASE}
              cdrLogs={INITIAL_CDR_LOGS}
              missingItems={INITIAL_MISSING_PERSONS}
              moujaPlots={INITIAL_MOUJA_PLOTS}
              voterRecords={INITIAL_VOTERS}
              govLinks={GOV_PORTAL_LINKS}
              selectedDistrict={selectedDistrict}
              authLogs={authLogs}
              onAddAuthLog={handleLogAuthAttempt}
            />
          )}

          {activeTab === 'srs_app' && (
            <SRSAppHub />
          )}

        </main>
      </div>

      {/* Role & Access Auth Modal */}
      <RoleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentRole={currentRole}
        onAuthenticate={handleAuthenticateRole}
        onLogAuthAttempt={handleLogAuthAttempt}
      />

      {/* Notifications Toast */}
      <NotificationToast
        isOpen={isNotificationPanelOpen}
        onClosePanel={() => setIsNotificationPanelOpen(false)}
        notifications={notifications}
        onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 px-6 text-center text-xs">
        <p>
          © 2026 <strong>Madani Global Ecosystem</strong> • Zero-Profit Community Welfare • Encrypted Law Enforcement Gateway • Bangladesh 64 Districts Network
        </p>
      </footer>

    </div>
  );
}
