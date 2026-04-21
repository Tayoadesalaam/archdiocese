import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Edit2, 
  Trash2,
  X,
  Check,
  Church
} from 'lucide-react';
import api from '@/services/api';

interface Parish {
  id: number;
  name: string;
  location: string;
  priest_id: number | null;
  priest_name?: string;
  deanery: string;
  phone: string;
  email: string;
  member_count?: number;
}

interface Priest {
  id: number;
  first_name: string;
  last_name: string;
}

const ParishManagement: React.FC = () => {
  const { user } = useAuth();
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [filteredParishes, setFilteredParishes] = useState<Parish[]>([]);
  const [priests, setPriests] = useState<Priest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingParish, setEditingParish] = useState<Parish | null>(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    deanery: '',
    phone: '',
    email: '',
    priest_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterParishes();
  }, [search, parishes]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch parishes
      const parishesRes = await api.get('/parishes');
      setParishes(parishesRes.data);
      setFilteredParishes(parishesRes.data);
      
      // Fetch priests for assignment
      const priestsRes = await api.get('/priests');
      setPriests(priestsRes.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('Failed to load parishes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterParishes = () => {
    if (!search) {
      setFilteredParishes(parishes);
      return;
    }
    
    const filtered = parishes.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.deanery.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredParishes(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parishData = {
        ...formData,
        priest_id: formData.priest_id ? Number(formData.priest_id) : null
      };

      if (editingParish) {
        // Update existing parish
        await api.put(`/parishes/${editingParish.id}`, parishData);
        showMessage('Parish updated successfully!', 'success');
      } else {
        // Create new parish
        await api.post('/parishes', parishData);
        showMessage('Parish created successfully!', 'success');
      }
      
      setShowForm(false);
      setEditingParish(null);
      resetForm();
      fetchData(); // Refresh the list
    } catch (error: any) {
      console.error('Error saving parish:', error);
      showMessage(error.response?.data?.detail || 'Failed to save parish', 'error');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/parishes/${id}`);
      showMessage('Parish deleted successfully!', 'success');
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting parish:', error);
      showMessage('Failed to delete parish', 'error');
    }
  };

  const handleEdit = (parish: Parish) => {
    setEditingParish(parish);
    setFormData({
      name: parish.name,
      location: parish.location,
      deanery: parish.deanery || '',
      phone: parish.phone || '',
      email: parish.email || '',
      priest_id: parish.priest_id?.toString() || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      deanery: '',
      phone: '',
      email: '',
      priest_id: ''
    });
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gold animate-pulse">Loading parishes...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="cathedral-bg" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-float-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-2">
              Parish Management
            </h1>
          </div>
          <button
            onClick={() => {
              setEditingParish(null);
              resetForm();
              setShowForm(!showForm);
            }}
            className="btn-gold flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add Parish</span>
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/20 border-green-500/30' : 'bg-destructive/20 border-destructive/30'
          } border animate-float-in`}>
            <p className="text-sm text-foreground">{message.text}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-float-in-delay-1">
          <div className="glass-card">
            <div className="text-2xl font-display text-primary">{parishes.length}</div>
            <div className="text-xs text-muted-foreground font-ui">Total Parishes</div>
          </div>
          <div className="glass-card">
            <div className="text-2xl font-display text-primary">
              {parishes.filter(p => p.priest_id).length}
            </div>
            <div className="text-xs text-muted-foreground font-ui">With Priest</div>
          </div>
          <div className="glass-card">
            <div className="text-2xl font-display text-primary">
              {parishes.filter(p => !p.priest_id).length}
            </div>
            <div className="text-xs text-muted-foreground font-ui">Vacant</div>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card mb-6 animate-float-in-delay-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by name, location, or deanery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground font-ui"
            />
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="glass-card mb-6 animate-float-in">
            <h3 className="text-lg font-display text-foreground mb-4">
              {editingParish ? 'Edit Parish' : 'Add New Parish'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1 block">
                    Parish Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g., St. Mary's Parish"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1 block">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g., Garki, Abuja"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1 block">
                    Deanery
                  </label>
                  <input
                    type="text"
                    value={formData.deanery}
                    onChange={(e) => setFormData({...formData, deanery: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g., Garki Deanery"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1 block">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g., 08012345678"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="parish@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1 block">
                    Assign Priest (Optional)
                  </label>
                  <select
                    value={formData.priest_id}
                    onChange={(e) => setFormData({...formData, priest_id: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {priests.map(priest => (
                      <option key={priest.id} value={priest.id}>
                        Fr. {priest.first_name} {priest.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-gold"
                >
                  {editingParish ? 'Update Parish' : 'Create Parish'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingParish(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Parishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-float-in-delay-3">
          {filteredParishes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Church size={48} className="mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
              <p className="text-muted-foreground">No parishes found</p>
            </div>
          ) : (
            filteredParishes.map((parish, index) => (
              <div
                key={parish.id}
                className={`glass-card hover:border-gold/30 transition-all hover:translate-y-[-2px] animate-float-in-delay-${(index % 3) + 1}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <Church className="w-8 h-8 text-gold" strokeWidth={1.5} />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(parish)}
                      className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(parish.id, parish.name)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="font-display text-base text-foreground mb-1">{parish.name}</h3>
                <p className="text-xs text-muted-foreground font-ui mb-3">{parish.location}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin size={12} className="text-gold" />
                    <span className="text-muted-foreground">Deanery: {parish.deanery || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <User size={12} className="text-gold" />
                    <span className="text-muted-foreground">
                      Priest: {parish.priest_name || 'Vacant'}
                    </span>
                  </div>
                  {parish.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone size={12} className="text-gold" />
                      <span className="text-muted-foreground">{parish.phone}</span>
                    </div>
                  )}
                  {parish.email && (
                    <div className="flex items-center gap-2 text-xs">
                      <Mail size={12} className="text-gold" />
                      <span className="text-muted-foreground">{parish.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border/30">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Parishioners</span>
                    <span className="text-foreground font-medium">{parish.member_count || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ParishManagement;