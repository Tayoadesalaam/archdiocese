import React, { useState, useEffect } from 'react';
import WelcomeSection from './WelcomeSection';
import StatCard from './StatCard';
import EventListCard from './EventListCard';
import QuickActionsCard from './QuickActionsCard';
import ScheduleManager from './ScheduleManager';  // Add this import
import { getEvents, getSacramentRecords, getAnnouncements } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import SacramentModal from './SacramentModal';

interface User {
  lastName?: string;
  firstName?: string;
  parishId?: number;
}

const PriestDashboard: React.FC<{ user: User }> = ({ user }) => {
  const { user: authUser } = useAuth();
  const [stats, setStats] = useState([
    { value: '0', label: 'Parishioners' },
    { value: '0', label: 'Sacraments' },
    { value: '0', label: 'Groups' },
    { value: '0', label: 'Masses/Week' },
  ]);
  
  const [sacraments, setSacraments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSacramentModalOpen, setIsSacramentModalOpen] = useState(false);

  useEffect(() => {
    fetchPriestData();
  }, []);

  const fetchPriestData = async () => {
    try {
      setLoading(true);
      
      // Fetch sacrament records
      try {
        const sacramentsData = await getSacramentRecords({ parish_id: user?.parishId });
        const formattedSacraments = sacramentsData.slice(0, 4).map((s: any) => ({
          id: s.id,
          title: s.member_name,
          subtitle: `${s.sacrament_type} • ${new Date(s.date_received).toLocaleDateString()}`
        }));
        setSacraments(formattedSacraments);
        
        setStats(prev => [
          { ...prev[0], value: '847' },
          { ...prev[1], value: sacramentsData.length.toString() },
          prev[2],
          prev[3]
        ]);
      } catch (error) {
        console.error('Error fetching sacraments:', error);
      }

      // Fetch announcements
      try {
        const announcementsData = await getAnnouncements();
        const formattedAnnouncements = announcementsData.slice(0, 2).map((ann: any) => ({
          id: ann.id,
          title: ann.title,
          subtitle: ann.content.length > 50 ? ann.content.substring(0, 50) + '...' : ann.content,
          priority: ann.priority,
          created_at: new Date(ann.created_at).toLocaleDateString(),
          creator_name: ann.creator_name
        }));
        setAnnouncements(formattedAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }

    } catch (error) {
      console.error('Error fetching priest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { icon: 'clock', label: 'Mass Times' },
    { icon: 'users', label: 'Council' },
    { icon: 'file-text', label: 'Finances' },
    { icon: 'mail', label: 'Announce' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gold animate-pulse">Loading parish data...</div>
      </div>
    );
  }

  return (
    <>
      <WelcomeSection
        title={`Fr. ${user?.lastName || authUser?.lastName || ''}`}
        subtitle="Our Lady Queen of Nigeria Parish • Garki"
        badgeText="✝ Parish Priest"
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
  linkTo="/sacraments"  // Add this prop
  items={sacraments.length > 0 ? sacraments : [
    { title: 'No sacraments yet', subtitle: 'Click "Add Sacrament Record" to add one' }
  ]}
  actionLabel="Add Sacrament Record"
  onAction={() => setIsSacramentModalOpen(true)}
  animDelay="animate-float-in-delay-2"
/>
        </div>
        <div className="lg:col-span-2">
          <div className="glass-card animate-float-in-delay-3">
            <h3 className="text-lg font-display font-medium text-foreground mb-4">Announcements</h3>
            <div className="flex flex-col gap-3">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-3 rounded-lg border ${
                      ann.priority === 'high' 
                        ? 'bg-gold/10 border-gold/30' 
                        : 'bg-secondary/30 border-border/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-foreground text-sm font-medium">{ann.title}</h4>
                      {ann.priority === 'high' && (
                        <span className="badge-gold text-[0.6rem]">HIGH</span>
                      )}
                    </div>
                    <p className="text-muted-foreground font-ui text-xs">{ann.subtitle}</p>
                    <div className="flex justify-end mt-2">
                      <span className="text-[0.6rem] text-muted-foreground">{ann.creator_name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No announcements
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Manager Section */}
      <div className="mb-6 animate-float-in-delay-4">
        <ScheduleManager parishId={user?.parishId || 1} />
      </div>

      <QuickActionsCard heading="Parish Management" actions={actions} animDelay="animate-float-in-delay-5" />
    
<SacramentModal
  isOpen={isSacramentModalOpen}
  onClose={() => setIsSacramentModalOpen(false)}
  onSuccess={fetchPriestData}
/>

    </>
  );
};



export default PriestDashboard;