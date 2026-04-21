import React, { useState, useEffect } from 'react';
import { getParishes } from '@/services/api';
import { Search, MapPin, Phone, Mail, Clock, Church, User } from 'lucide-react';

interface Parish {
  id: number;
  name: string;
  location: string;
  priest_name: string | null;
  deanery: string;
  phone: string;
  email: string;
  member_count: number;
}

const Parishes: React.FC = () => {
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchParishes();
  }, []);

  const fetchParishes = async () => {
    try {
      setLoading(true);
      const data = await getParishes();
      console.log('Parishes data:', data);
      setParishes(data);
    } catch (error) {
      console.error('Error fetching parishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParishes = parishes.filter(parish => {
    return parish.name.toLowerCase().includes(search.toLowerCase()) ||
           parish.location.toLowerCase().includes(search.toLowerCase()) ||
           (parish.deanery && parish.deanery.toLowerCase().includes(search.toLowerCase()));
  });

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="cathedral-bg" />
        <div className="flex justify-center items-center h-64">
          <div className="text-gold animate-pulse">Loading parishes...</div>
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
          <Church className="w-12 h-12 mx-auto mb-4 text-gold" strokeWidth={1.5} />
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            Our Parishes
          </h1>
          <p className="text-muted-foreground font-ui text-sm max-w-2xl mx-auto">
            Find a parish community near you in the Archdiocese of Abuja
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 animate-float-in-delay-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by name, location, or deanery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground font-ui placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6 animate-float-in-delay-2">
          <span className="text-sm text-muted-foreground font-ui">
            Found {filteredParishes.length} {filteredParishes.length === 1 ? 'parish' : 'parishes'}
          </span>
        </div>

        {/* Parishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParishes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Church size={48} className="mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
              <p className="text-muted-foreground font-ui">No parishes found matching your search.</p>
            </div>
          ) : (
            filteredParishes.map((parish, i) => (
              <div key={parish.id} className={`glass-card animate-float-in-delay-${(i % 3) + 1} hover:border-gold/30 transition-all hover:translate-y-[-2px]`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Church className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-foreground">{parish.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-gold" />
                      <p className="text-xs text-muted-foreground font-ui">{parish.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {parish.priest_name && (
                    <div className="flex items-center gap-2 text-xs">
                      <User size={12} className="text-gold" />
                      <span className="text-muted-foreground font-ui">{parish.priest_name}</span>
                    </div>
                  )}
                  {parish.deanery && (
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin size={12} className="text-gold" />
                      <span className="text-muted-foreground font-ui">{parish.deanery}</span>
                    </div>
                  )}
                  {parish.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone size={12} className="text-gold" />
                      <span className="text-muted-foreground font-ui">{parish.phone}</span>
                    </div>
                  )}
                  {parish.email && (
                    <div className="flex items-center gap-2 text-xs">
                      <Mail size={12} className="text-gold" />
                      <span className="text-muted-foreground font-ui">{parish.email}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/30 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gold" />
                      <span className="text-xs text-muted-foreground font-ui">Mass Times:</span>
                    </div>
                    <span className="text-xs text-gold hover:text-gold/80 cursor-pointer">View Schedule →</span>
                  </div>
                </div>

                <button className="btn-gold !mt-4 !py-2 text-xs w-full">
                  View Parish Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Parishes;