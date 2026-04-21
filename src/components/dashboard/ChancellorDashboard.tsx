import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeSection from './WelcomeSection';
import StatCard from './StatCard';
import EventListCard from './EventListCard';
import QuickActionsCard from './QuickActionsCard';
import { getEvents, getParishes, getSacramentRecords, getAnnouncements, getPriests } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface User {
  lastName?: string;
  firstName?: string;
  role?: string;
}

const ChancellorDashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [stats, setStats] = useState([
    { value: '0', label: 'Parishes' },
    { value: '0', label: 'Priests' },
    { value: '0', label: 'Sacraments' },
    { value: '0', label: 'Events' },
  ]);
  
  const [events, setEvents] = useState<any[]>([]);
  const [sacraments, setSacraments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      const eventsData = await getEvents();
      const formattedEvents = eventsData.slice(0, 4).map((event: any) => ({
        id: event.id,
        title: event.title,
        subtitle: `${new Date(event.date).toLocaleDateString()} • ${event.time || 'TBA'}`,
        badge: event.event_type
      }));
      setEvents(formattedEvents);

      // Fetch parishes count
      try {
        const parishesData = await getParishes();
        setStats(prev => [
          { ...prev[0], value: parishesData.length.toString() },
          prev[1],
          prev[2],
          prev[3]
        ]);
      } catch (error) {
        console.error('Error fetching parishes:', error);
      }

      // Fetch priests count
      try {
        const priestsData = await getPriests();
        setStats(prev => [
          prev[0],
          { ...prev[1], value: priestsData.length.toString() },
          prev[2],
          prev[3]
        ]);
      } catch (error) {
        console.error('Error fetching priests:', error);
      }

      // Fetch sacraments count
      try {
        const sacramentsData = await getSacramentRecords();
        setStats(prev => [
          prev[0],
          prev[1],
          { ...prev[2], value: sacramentsData.length.toString() },
          prev[3]
        ]);
        
        const formattedSacraments = sacramentsData.slice(0, 4).map((s: any) => ({
          id: s.id,
          title: s.member_name,
          subtitle: `${s.sacrament_type} • ${new Date(s.date_received).toLocaleDateString()}`
        }));
        setSacraments(formattedSacraments);
      } catch (error) {
        console.error('Error fetching sacraments:', error);
      }

      // Fetch announcements
      try {
        const announcementsData = await getAnnouncements();
        const formattedAnnouncements = announcementsData.slice(0, 3).map((ann: any) => ({
          id: ann.id,
          title: ann.title,
          subtitle: ann.content.length > 50 ? ann.content.substring(0, 50) + '...' : ann.content,
          priority: ann.priority
        }));
        setAnnouncements(formattedAnnouncements);
        setStats(prev => [
          prev[0],
          prev[1],
          prev[2],
          { ...prev[3], value: announcementsData.length.toString() }
        ]);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { icon: 'users', label: 'Manage Priests', onClick: () => navigate('/priests') },
    { icon: 'file-text', label: 'All Records', onClick: () => navigate('/sacraments') },
    { icon: 'mail', label: 'Send Message', onClick: () => navigate('/announcements') },
    { icon: 'calendar', label: 'Events', onClick: () => navigate('/events') },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gold animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <WelcomeSection
        title={`Chancellor ${user?.lastName || authUser?.lastName || ''}`}
        subtitle="Chancellor's Office • Archdiocese of Abuja"
        badgeText="✝ Chancellor"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} value={stat.value} label={stat.label} delay={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <EventListCard
            heading="Recent Sacraments"
            linkText="View all"
            linkTo="/sacraments"
            items={sacraments.length > 0 ? sacraments : [
              { id: 0, title: 'No sacraments', subtitle: 'No records found' }
            ]}
            actionLabel="View All Records"
            onAction={() => navigate('/sacraments')}
            animDelay="animate-float-in-delay-2"
          />
        </div>
        <div className="lg:col-span-2">
          <EventListCard
            heading="Priority Announcements"
            linkText="All"
            linkTo="/announcements"
            items={announcements.length > 0 ? announcements : [
              { id: 0, title: 'No announcements', subtitle: 'No announcements found' }
            ]}
            actionLabel="Send Announcement"
            onAction={() => navigate('/announcements')}
            animDelay="animate-float-in-delay-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <EventListCard
          heading="Upcoming Events"
          linkText="View all"
          linkTo="/events"
          items={events.length > 0 ? events : [
            { id: 0, title: 'No events', subtitle: 'No upcoming events' }
          ]}
          actionLabel="Create Event"
          onAction={() => navigate('/events')}
          animDelay="animate-float-in-delay-4"
        />
      </div>

      <QuickActionsCard heading="Quick Actions" actions={actions} animDelay="animate-float-in-delay-5" />
    </>
  );
};

export default ChancellorDashboard;