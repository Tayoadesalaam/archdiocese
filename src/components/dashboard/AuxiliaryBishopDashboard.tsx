import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Church, Users, Calendar, Bell, FileText, BarChart, UserPlus, Mail } from 'lucide-react';
import WelcomeSection from './WelcomeSection';
import StatCard from './StatCard';
import EventListCard from './EventListCard';
import QuickActionsCard from './QuickActionsCard';
import { getEvents, getParishes, getSacramentRecords, getAnnouncements } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface User {
  lastName?: string;
  firstName?: string;
  deaneryId?: number;
  role?: string;
}

const AuxiliaryBishopDashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [stats, setStats] = useState([
    { value: '0', label: 'Parishes' },
    { value: '0', label: 'Priests' },
    { value: '0', label: 'Sacraments' },
    { value: '0', label: 'Deaneries' },
  ]);
  
  const [events, setEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch events (filtered by deanery on backend)
      const eventsData = await getEvents();
      const formattedEvents = eventsData.slice(0, 4).map((event: any) => ({
        id: event.id,
        title: event.title,
        subtitle: `${new Date(event.date).toLocaleDateString()} • ${event.time || 'TBA'}`,
        badge: event.event_type
      }));
      setEvents(formattedEvents);

      // Fetch parishes count for the deanery
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
    { icon: 'users', label: 'View Priests', onClick: () => navigate('/priests') },
    { icon: 'file-text', label: 'Records', onClick: () => navigate('/sacraments') },
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
        title={`Auxiliary Bishop ${user?.lastName || authUser?.lastName || ''}`}
        subtitle="Auxiliary Bishop of Abuja • Overseeing Deanery"
        badgeText="✝ Auxiliary Bishop"
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
            linkTo="/events"
            items={events.length > 0 ? events : [
              { id: 0, title: 'No upcoming events', subtitle: 'No events scheduled in your deanery' }
            ]}
            actionLabel="Schedule Event"
            animDelay="animate-float-in-delay-2"
          />
        </div>
        <div className="lg:col-span-2">
          <EventListCard
            heading="Announcements"
            linkText="All"
            linkTo="/announcements"
            items={announcements.length > 0 ? announcements : [
              { id: 0, title: 'No announcements', subtitle: 'No announcements for your deanery' }
            ]}
            actionLabel="Send Announcement"
            animDelay="animate-float-in-delay-3"
          />
        </div>
      </div>

      <QuickActionsCard heading="Quick Actions" actions={actions} animDelay="animate-float-in-delay-4" />
    </>
  );
};

export default AuxiliaryBishopDashboard;