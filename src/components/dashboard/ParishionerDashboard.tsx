import React from 'react';
import WelcomeSection from './WelcomeSection';
import StatCard from './StatCard';
import EventListCard from './EventListCard';
import QuickActionsCard from './QuickActionsCard';

interface User {
  lastName?: string;
  firstName?: string;
  role?: string;
}

const ParishionerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const stats = [
    { value: '3', label: 'Sacraments' },
    { value: '2', label: 'Groups' },
    { value: '15', label: 'Events' },
    { value: '48', label: 'Donations' },
  ];

  const upcoming = [
    { title: 'Sunday Mass', subtitle: '8:00 AM • This Sunday', badge: 'Worship' },
    { title: 'Lenten Retreat', subtitle: 'Mar 22, 2024 • 9:00 AM', badge: 'Retreat' },
    { title: 'Parish Bazaar', subtitle: 'Mar 30, 2024 • 12:00 PM', badge: 'Community' },
  ];

  const mySacraments = [
    { title: 'Baptism', subtitle: 'Received • January 15, 2000' },
    { title: 'First Holy Communion', subtitle: 'Received • May 20, 2008' },
    { title: 'Confirmation', subtitle: 'Received • November 12, 2015' },
  ];

  const actions = [
    { icon: 'clock', label: 'Mass Times' },
    { icon: 'heart', label: 'Donate' },
    { icon: 'calendar', label: 'Daily Reading' },
    { icon: 'phone', label: 'Contact Parish' },
  ];

  return (
    <>
      <WelcomeSection
        title={`${user?.firstName || 'Welcome'} ${user?.lastName || ''}`}
        subtitle="Our Lady Queen of Nigeria Parish • Garki"
        badgeText="✝ Parishioner"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} value={stat.value} label={stat.label} delay={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <EventListCard
            heading="Upcoming Events"
            linkText="View all"
            items={upcoming}
            actionLabel="View Parish Calendar"
            animDelay="animate-float-in-delay-2"
          />
        </div>
        <div className="lg:col-span-2">
          <EventListCard
            heading="My Sacraments"
            items={mySacraments}
            actionLabel="Request Certificate"
            animDelay="animate-float-in-delay-3"
          />
        </div>
      </div>

      <QuickActionsCard heading="Quick Actions" actions={actions} animDelay="animate-float-in-delay-4" />
    </>
  );
};

export default ParishionerDashboard;