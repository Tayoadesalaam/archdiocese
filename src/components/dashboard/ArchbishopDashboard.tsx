import React, { useState, useEffect } from 'react';
import WelcomeSection from './WelcomeSection';
import StatCard from './StatCard';
import EventListCard from './EventListCard';
import QuickActionsCard from './QuickActionsCard';
import { getEvents, getParishes, getPriests, getAnnouncements } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import AnnouncementModal from './AnnouncementModal';
import EventModal from './EventModal';
import PriestManagement from './PriestManagement';
import { X, Church } from 'lucide-react';  // Add this to your existing imports
import { useNavigate } from 'react-router-dom'; 

interface User {
  lastName?: string;
  role?: string;
}

interface Event {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  subtitle?: string;
  priority: string;
  created_at: string;
  creator_name?: string;
}

const ArchbishopDashboard: React.FC<{ user: User }> = ({ user }) => {
  const { user: authUser } = useAuth();
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [stats, setStats] = useState([
    { value: '0', label: 'Parishes' },
    { value: '0', label: 'Priests' },
    { value: '0', label: 'Deaneries' },
    { value: '0', label: 'Institutions' },
  ]);
  
  const navigate = useNavigate();  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPriestManagement, setShowPriestManagement] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      const eventsData = await getEvents();
      console.log('Events data:', eventsData);
      
      // Format events for display
      const formattedEvents = eventsData.map((event: any) => ({
        id: event.id,
        title: event.title,
        subtitle: `${new Date(event.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })} • ${event.time || 'TBA'}`,
        badge: event.event_type?.charAt(0).toUpperCase() + event.event_type?.slice(1)
      }));
      
      setEvents(formattedEvents.slice(0, 4));

      // Fetch announcements
      try {
        const announcementsData = await getAnnouncements();
        console.log('Announcements data:', announcementsData);
        
        // Format announcements for display
        const formattedAnnouncements = announcementsData.map((ann: any) => ({
          id: ann.id,
          title: ann.title,
          content: ann.content,
          subtitle: ann.content.length > 50 ? ann.content.substring(0, 50) + '...' : ann.content,
          priority: ann.priority,
          created_at: new Date(ann.created_at).toLocaleDateString(),
          creator_name: ann.creator_name
        }));
        
        setAnnouncements(formattedAnnouncements.slice(0, 3)); // Show latest 3
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }

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

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

const actions = [
  { icon: 'users', label: 'Appoint Priest', onClick: () => setShowPriestManagement(true) },
  { icon: 'file-text', label: 'Records', onClick: () => navigate('/sacraments') },
  { icon: 'mail', label: 'Message', onClick: () => navigate('/announcements') },
  { icon: 'chapel', label: 'Parishes', onClick: () => navigate('/parish-management') },  
];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gold animate-pulse">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <>
      <WelcomeSection
        title={`Archbishop ${user?.lastName || authUser?.lastName || ''}`}
        subtitle="Archdiocese of Abuja • Ordinary"
        badgeText="✝ Since 1981"
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
  items={events.length > 0 ? events : [
    { id: 0, title: 'No upcoming events', subtitle: 'Click "Schedule New Event" to create one' }
  ]}
  actionLabel="Schedule New Event"
  onAction={() => setIsEventModalOpen(true)}  // Add this line
  animDelay="animate-float-in-delay-2"
/>
        </div>
<div className="lg:col-span-2">
  <EventListCard
    heading="Priority Announcements"
    linkText="All"
    linkTo="/announcements"
    items={announcements.map(ann => ({
      id: ann.id,
      title: ann.title,
      subtitle: ann.subtitle || ann.content || 'No content',
      badge: ann.priority === 'high' ? 'HIGH' : undefined
    }))}
    actionLabel="Compose Announcement"
    onAction={() => setIsAnnouncementModalOpen(true)}
    animDelay="animate-float-in-delay-3"
  />
</div>
      </div>

      <QuickActionsCard heading="Quick Actions" actions={actions} animDelay="animate-float-in-delay-4" />

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
  <EventModal
  isOpen={isEventModalOpen}
  onClose={() => setIsEventModalOpen(false)}
  onSuccess={fetchDashboardData}
/>

{showPriestManagement && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
    <div className="max-w-4xl w-full">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowPriestManagement(false)}
          className="p-2 rounded-lg bg-background/80 hover:bg-background text-foreground"
        >
          <X size={20} />
        </button>
      </div>
      <PriestManagement />
    </div>
  </div>
)}

    </>
  );
};


export default ArchbishopDashboard;