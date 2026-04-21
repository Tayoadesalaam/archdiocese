import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAnnouncements } from '@/services/api';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  Calendar, 
  User, 
  Church,
  Bell,
  BellRing,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Announcement {
  id: number;
  title: string;
  content: string;
  parish_id: number | null;
  parish_name?: string;
  priority: string;
  created_by: number;
  creator_name?: string;
  created_at: string;
}

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedParish, setSelectedParish] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [parishes, setParishes] = useState<{ id: number; name: string }[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchAnnouncements();
    fetchParishes();
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [search, selectedParish, selectedPriority, selectedAuthor, announcements]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      // Sort by date (newest first) and priority (high first)
      const sorted = data.sort((a: Announcement, b: Announcement) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setAnnouncements(sorted);
      setFilteredAnnouncements(sorted);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParishes = async () => {
    try {
      const response = await fetch('/api/parishes');
      const data = await response.json();
      setParishes(data);
    } catch (error) {
      console.error('Error fetching parishes:', error);
    }
  };

  const filterAnnouncements = () => {
    let filtered = [...announcements];

    // Search in title and content
    if (search) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by parish
    if (selectedParish !== 'all') {
      if (selectedParish === 'archdiocesan') {
        filtered = filtered.filter(a => a.parish_id === null);
      } else {
        filtered = filtered.filter(a => a.parish_name === selectedParish);
      }
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(a => a.priority === selectedPriority);
    }

    // Filter by author
    if (selectedAuthor !== 'all') {
      if (selectedAuthor === 'archbishop') {
        filtered = filtered.filter(a => a.creator_name?.includes('Archbishop'));
      } else {
        filtered = filtered.filter(a => a.creator_name?.includes('Fr.'));
      }
    }

    setFilteredAnnouncements(filtered);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedParish('all');
    setSelectedPriority('all');
    setSelectedAuthor('all');
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getParishDisplay = (announcement: Announcement) => {
    if (announcement.parish_id === null) {
      return (
        <span className="flex items-center gap-1 text-xs text-gold">
          <BellRing size={12} />
          Archdiocesan
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Church size={12} className="text-gold" />
        {announcement.parish_name}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="cathedral-bg" />
        <div className="flex justify-center items-center h-64">
          <div className="text-gold animate-pulse">Loading announcements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="cathedral-bg" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-float-in">
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            Announcements
          </h1>
          <p className="text-muted-foreground font-ui text-sm max-w-2xl mx-auto">
            Stay updated with news and notifications from across the archdiocese
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-float-in-delay-1">
          <div className="glass-card text-center">
            <div className="text-2xl font-display text-white">{announcements.length}</div>
            <div className="text-xs text-muted-foreground font-ui">Total</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-display text-white">
              {announcements.filter(a => a.priority === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground font-ui">High Priority</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-display text-white-400">
              {announcements.filter(a => a.parish_id === null).length}
            </div>
            <div className="text-xs text-muted-foreground font-ui">Archdiocesan</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-display text-white-400">
              {announcements.filter(a => a.parish_id !== null).length}
            </div>
            <div className="text-xs text-muted-foreground font-ui">Parish</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card mb-6 animate-float-in-delay-2">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground font-ui"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-sm font-ui text-muted-foreground hover:text-foreground transition-colors"
            >
              <Filter size={16} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Clear Filters */}
            {(search || selectedParish !== 'all' || selectedPriority !== 'all' || selectedAuthor !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-sm font-ui text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
              {/* Parish Filter */}
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  <Church size={12} className="inline mr-1" />
                  Parish
                </label>
                <select
                  value={selectedParish}
                  onChange={(e) => setSelectedParish(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground font-ui"
                >
                  <option value="all">All Parishes</option>
                  <option value="archdiocesan">Archdiocesan Only</option>
                  {parishes.map(parish => (
                    <option key={parish.id} value={parish.name}>
                      {parish.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  <Bell size={12} className="inline mr-1" />
                  Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground font-ui"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              {/* Author Filter */}
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  <User size={12} className="inline mr-1" />
                  Author
                </label>
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground font-ui"
                >
                  <option value="all">All Authors</option>
                  <option value="archbishop">Archbishop</option>
                  <option value="priest">Priests</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4 animate-float-in-delay-3">
          <p className="text-sm text-muted-foreground font-ui">
            Showing {filteredAnnouncements.length} of {announcements.length} announcements
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4 animate-float-in-delay-3">
          {filteredAnnouncements.length === 0 ? (
            <div className="glass-card text-center py-12">
              <Bell size={48} className="mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
              <p className="text-muted-foreground">No announcements found</p>
              {(search || selectedParish !== 'all' || selectedPriority !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-gold hover:text-gold/80 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`glass-card hover:border-gold/30 transition-all ${
                  announcement.priority === 'high' ? 'border-gold/30 bg-gold/5' : ''
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {announcement.priority === 'high' ? (
                      <BellRing size={18} className="text-gold" />
                    ) : (
                      <Bell size={18} className="text-muted-foreground" />
                    )}
                    <h3 className="font-display text-base text-foreground">
                      {announcement.title}
                    </h3>
                  </div>
                  {announcement.priority === 'high' && (
                    <span className="badge-gold text-[0.6rem]">HIGH PRIORITY</span>
                  )}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className={`text-sm text-muted-foreground font-ui ${
                    expandedId !== announcement.id ? 'line-clamp-3' : ''
                  }`}>
                    {announcement.content}
                  </p>
                  {announcement.content.length > 200 && (
                    <button
                      onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                      className="text-gold hover:text-gold/80 text-xs font-ui mt-2 flex items-center gap-1"
                    >
                      {expandedId === announcement.id ? 'Show less' : 'Read more'}
                      <ChevronRight size={12} className={`transform transition-transform ${
                        expandedId === announcement.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border/30 text-xs">
                  <div className="flex items-center gap-1">
                    <User size={12} className="text-gold" />
                    <span className="text-muted-foreground">{announcement.creator_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-gold" />
                    <span className="text-muted-foreground">
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-gold" />
                    <span className="text-muted-foreground">{getTimeAgo(announcement.created_at)}</span>
                  </div>
                  {getParishDisplay(announcement)}
                </div>

                {/* Actions */}
                {(user?.role === 'ARCHBISHOP' || user?.role === 'PRIEST') && (
                  <div className="flex justify-end gap-2 mt-3 pt-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-ui text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;