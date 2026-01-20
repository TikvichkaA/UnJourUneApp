'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ToastProvider } from '@/components/Toast';
import LoginPage from '@/components/LoginPage';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import NouveauSignalement from '@/components/NouveauSignalement';
import DetailSignalement from '@/components/DetailSignalement';
import Stats from '@/components/Stats';
import Admin from '@/components/Admin';

type Page = 'dashboard' | 'nouveau' | 'detail' | 'stats' | 'admin';

function AppContent() {
  const { currentUser } = useStore();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedSignalementId, setSelectedSignalementId] = useState<string | null>(null);

  if (!currentUser) {
    return <LoginPage />;
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page !== 'detail') {
      setSelectedSignalementId(null);
    }
  };

  const handleViewDetail = (id: string) => {
    setSelectedSignalementId(id);
    setCurrentPage('detail');
  };

  const handleBackFromDetail = () => {
    setSelectedSignalementId(null);
    setCurrentPage('dashboard');
  };

  const handleSignalementCreated = () => {
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onViewDetail={handleViewDetail} />;
      case 'nouveau':
        return <NouveauSignalement onSuccess={handleSignalementCreated} />;
      case 'detail':
        return selectedSignalementId ? (
          <DetailSignalement
            signalementId={selectedSignalementId}
            onBack={handleBackFromDetail}
          />
        ) : (
          <Dashboard onViewDetail={handleViewDetail} />
        );
      case 'stats':
        return <Stats />;
      case 'admin':
        return <Admin />;
      default:
        return <Dashboard onViewDetail={handleViewDetail} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
