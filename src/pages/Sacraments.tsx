import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSacramentRecords } from '@/services/api';
import { Search, Calendar, Filter, ChevronDown, Church, User, X, Droplets, Flame, Heart, BookOpen, Cross, Sparkles } from 'lucide-react';

const sacramentTypes = [
  { value: 'BAPTISM', label: 'Baptism', icon: Droplets, color: 'blue' },
  { value: 'CONFIRMATION', label: 'Confirmation', icon: Flame, color: 'red' },
  { value: 'FIRST_COMMUNION', label: 'First Communion', icon: Heart, color: 'yellow' },
  { value: 'MARRIAGE', label: 'Marriage', icon: Heart, color: 'pink' },
  { value: 'HOLY_ORDERS', label: 'Holy Orders', icon: Cross, color: 'purple' },
  { value: 'ANOINTING', label: 'Anointing of the Sick', icon: Sparkles, color: 'green' },
];

const Sacraments: React.FC = () => {
  const { user } = useAuth();
  const [sacraments, setSacraments] = useState<any[]>([]);
  const [filteredSacraments, setFilteredSacraments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedParish, setSelectedParish] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [parishes, setParishes] = useState<{ id: number; name: string }[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    baptism: 0,
    confirmation: 0,
    marriage: 0
  });

  useEffect(() => {
    fetchSacraments();
    fetchParishes();
  }, []);

  useEffect(() => {
    filterSacraments();
  }, [search, selectedType, selectedParish, sacraments]);

  const fetchSacraments = async () => {
    try {
      setLoading(true);
      const data = await getSacramentRecords();
      setSacraments(data);
      setFilteredSacraments(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        baptism: data.filter((s: any) => s.sacrament_type === 'BAPTISM').length,
        confirmation: data.filter((s: any) => s.sacrament_type === 'CONFIRMATION').length,
        marriage: data.filter((s: any) => s.sacrament_type === 'MARRIAGE').length,
      });
    } catch (error) {
      console.error('Error fetching sacraments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParishes = async () => {
    try {
      // This would come from your API
      const response = await fetch('/api/parishes');
      const data = await response.json();
      setParishes(data);
    } catch (error) {
      console.error('Error fetching parishes:', error);
    }
  };

  const filterSacraments = () => {
    let filtered = [...sacraments];

    // Filter by search (member name)
    if (search) {
      filtered = filtered.filter(s => 
        s.member_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by sacrament type
    if (selectedType) {
      filtered = filtered.filter(s => s.sacrament_type === selectedType);
    }

    // Filter by parish
    if (selectedParish) {
      filtered = filtered.filter(s => s.parish_name === selectedParish);
    }

    setFilteredSacraments(filtered);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedType('');
    setSelectedParish('');
  };

  const getTypeIcon = (type: string) => {
    const found = sacramentTypes.find(t => t.value === type);
    const Icon = found?.icon;
    return Icon ? <Icon size={14} className="mr-1" /> : null;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'BAPTISM': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      'CONFIRMATION': 'bg-red-500/20 text-red-500 border-red-500/30',
      'FIRST_COMMUNION': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      'MARRIAGE': 'bg-pink-500/20 text-pink-500 border-pink-500/30',
      'HOLY_ORDERS': 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      'ANOINTING': 'bg-green-500/20 text-green-500 border-green-500/30',
    };
    return colors[type] || 'bg-secondary/30 text-muted-foreground border-border/40';
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="cathedral-bg" />
        <div className="flex justify-center items-center h-64">
          <div className="text-gold animate-pulse">Loading sacraments...</div>
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
            Sacramental Records
          </h1>
          <p className="text-muted-foreground font-ui text-sm max-w-2xl mx-auto">
            View and manage all sacraments across the archdiocese
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-float-in-delay-1">
          <div className="glass-card text-center">
            <div className="text-2xl font-display text-white">{stats.total}</div>
            <div className="text-xs text-muted-foreground font-ui">Total Records</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-display text-white">{stats.baptism}</div>
            <div className="text-xs text-muted-foreground font-ui">Baptisms</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-display text-white">{stats.confirmation}</div>
            <div className="text-xs text-muted-foreground font-ui">Confirmations</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-display text-white">{stats.marriage}</div>
            <div className="text-xs text-muted-foreground font-ui">Marriages</div>
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
                placeholder="Search by name..."
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
            {(search || selectedType || selectedParish) && (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
              {/* Type Filter */}
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  Sacrament Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground font-ui"
                >
                  <option value="">All Types</option>
                  {sacramentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Parish Filter */}
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  Parish
                </label>
                <select
                  value={selectedParish}
                  onChange={(e) => setSelectedParish(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground font-ui"
                >
                  <option value="">All Parishes</option>
                  {parishes.map(parish => (
                    <option key={parish.id} value={parish.name}>
                      {parish.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground font-ui mb-4 animate-float-in-delay-3">
          Showing {filteredSacraments.length} of {sacraments.length} records
        </div>

        {/* Sacraments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-float-in-delay-3">
          {filteredSacraments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No sacraments found</p>
            </div>
          ) : (
            filteredSacraments.map((sacrament, index) => {
              const TypeIcon = sacramentTypes.find(t => t.value === sacrament.sacrament_type)?.icon;
              
              return (
                <div
                  key={sacrament.id}
                  className={`glass-card hover:border-gold/30 transition-all hover:translate-y-[-2px] animate-float-in-delay-${(index % 3) + 1}`}
                >
                  {/* Type Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full border flex items-center ${getTypeColor(sacrament.sacrament_type)}`}>
                      {TypeIcon && <TypeIcon size={14} className="mr-1" />}
                      {sacrament.sacrament_type}
                    </span>
                    <Calendar size={14} className="text-muted-foreground" />
                  </div>

                  {/* Member Name */}
                  <h3 className="font-display text-base text-foreground mb-2">
                    {sacrament.member_name}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Church size={12} className="text-gold" />
                      <span className="text-muted-foreground">{sacrament.parish_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <User size={12} className="text-gold" />
                      <span className="text-muted-foreground">Minister: {sacrament.minister_name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar size={12} className="text-gold" />
                      <span className="text-muted-foreground">
                        {new Date(sacrament.date_received).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-border/30">
                    <button className="flex-1 btn-gold !py-1.5 !text-xs">
                      View Details
                    </button>
                    {(user?.role === 'ARCHBISHOP' || user?.role === 'PRIEST') && (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50 transition-colors">
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Sacraments;