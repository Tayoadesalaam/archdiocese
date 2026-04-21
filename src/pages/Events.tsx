import React, { useState, useEffect } from 'react';
import { getEvents } from '@/services/api';
import { Calendar, Search, Clock, MapPin, Church } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  event_type: string;
  is_archdiocesan: boolean;
  parish_name: string | null;
  creator_name: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      const sorted = data.sort((a: Event, b: Event) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEvents(sorted);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search and type filter
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                         event.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || event.event_type === filter;
    return matchesSearch && matchesFilter;
  });

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'worship': 'bg-gold/10 text-gold border-gold/30',
      'youth': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      'clergy': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      'general': 'bg-secondary/30 text-muted-foreground border-border/40',
    };
    return colors[type] || colors['general'];
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="cathedral-bg" />
        <div className="flex justify-center items-center h-64">
          <div className="text-gold animate-pulse">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="cathedral-bg" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-float-in">

          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            Archdiocesan Events
          </h1>
          <p className="text-muted-foreground font-ui text-sm max-w-2xl mx-auto">
            Stay connected with what's happening across the Archdiocese
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-float-in-delay-1">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground font-ui placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'worship', label: 'Worship' },
              { value: 'youth', label: 'Youth' },
              { value: 'clergy', label: 'Clergy' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-xs font-ui capitalize transition-colors ${
                  filter === f.value 
                    ? 'bg-gold text-background' 
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground font-ui">No events found matching your search.</p>
            </div>
          ) : (
            filteredEvents.map((event, i) => (
              <div key={event.id} className={`glass-card animate-float-in-delay-${(i % 3) + 2} hover:border-gold/30 transition-colors`}>
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg border border-gold/20 flex flex-col items-center justify-center">
                    <span className="text-xs text-gold font-ui uppercase">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-display text-gold">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base text-foreground">{event.title}</h3>
                      <span className={`text-[0.6rem] px-2 py-0.5 rounded-full border ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground font-ui mt-1 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-gold" />
                        <span className="text-xs text-muted-foreground font-ui">{event.time || 'TBA'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-gold" />
                        <span className="text-xs text-muted-foreground font-ui">{event.location || event.parish_name || 'Archdiocesan'}</span>
                      </div>
                      {event.is_archdiocesan && (
                        <div className="flex items-center gap-1">
                          <Church size={12} className="text-gold" />
                          <span className="text-xs text-gold font-ui">Archdiocesan</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <span className="badge-gold text-[0.6rem] capitalize">{event.event_type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 btn-gold !py-2 !text-xs">
                    Add to Calendar
                  </button>
                  <button className="px-4 py-2 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;