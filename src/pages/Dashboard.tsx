import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import ArchbishopDashboard from '@/components/dashboard/ArchbishopDashboard';
import PriestDashboard from '@/components/dashboard/PriestDashboard';
import ParishionerDashboard from '@/components/dashboard/ParishionerDashboard';
import AuxiliaryBishopDashboard from '@/components/dashboard/AuxiliaryBishopDashboard';
import ChancellorDashboard from '@/components/dashboard/ChancellorDashboard';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('Dashboard - user:', user);
  console.log('Dashboard - isAuthenticated:', isAuthenticated);
  console.log('Dashboard - isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="cathedral-bg" />
        <div className="text-center">
          <div className="text-gold text-xl animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('Dashboard - redirecting to login');
    return <Navigate to="/login" replace />;
  }

const renderDashboard = () => {
  switch (user.role) {
    case 'ARCHBISHOP':
      return <ArchbishopDashboard user={user} />;
    case 'AUXILIARY_BISHOP':
      return <AuxiliaryBishopDashboard user={user} />;
    case 'CHANCELLOR':
      return <ChancellorDashboard user={user} />;
    case 'PRIEST':
      return <PriestDashboard user={user} />;
    case 'LAITY':
      return <ParishionerDashboard user={user} />;
    default:
      return <div>Unknown role: {user.role}</div>;
  }
};

  return (
    <div className="relative min-h-screen">
      <div className="cathedral-bg" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;