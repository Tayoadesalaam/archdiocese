import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus, Church, MapPin, Users, User, Mail, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

interface Priest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  parish_id: number | null;
}

interface Parish {
  id: number;
  name: string;
  location: string;
  priest_id: number | null;
}

const PriestManagement: React.FC = () => {
  const { user } = useAuth();
  const [priests, setPriests] = useState<Priest[]>([]);
  const [unassignedPriests, setUnassignedPriests] = useState<Priest[]>([]);
  const [vacantParishes, setVacantParishes] = useState<Parish[]>([]);
  const [allParishes, setAllParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriest, setSelectedPriest] = useState<number | null>(null);
  const [selectedParish, setSelectedParish] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);  // Make sure this exists
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // New priest form state
  const [newPriest, setNewPriest] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    parish_id: '' as string | number
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all priests
      const priestsRes = await api.get('/priests');
      setPriests(priestsRes.data);
      
      // Fetch unassigned priests
      const unassignedRes = await api.get('/priests/unassigned');
      setUnassignedPriests(unassignedRes.data);
      
      // Fetch vacant parishes
      const vacantRes = await api.get('/priests/vacant-parishes');
      setVacantParishes(vacantRes.data);
      
      // Fetch all parishes for dropdown
      const parishesRes = await api.get('/parishes');
      setAllParishes(parishesRes.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePriest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const priestData = {
        ...newPriest,
        parish_id: newPriest.parish_id ? Number(newPriest.parish_id) : null
      };
      
      await api.post('/priests/create', priestData);
      
      showMessage('Priest created successfully!', 'success');
      setShowCreateModal(false);
      setNewPriest({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        parish_id: ''
      });
      fetchData(); // Refresh the lists
    } catch (error: any) {
      console.error('Error creating priest:', error);
      showMessage(error.response?.data?.detail || 'Failed to create priest', 'error');
    }
  };

  const handleAssign = async () => {
    if (!selectedPriest || !selectedParish) {
      showMessage('Please select both a priest and a parish', 'error');
      return;
    }

    try {
      await api.post('/priests/assign', null, {
        params: { priest_id: selectedPriest, parish_id: selectedParish }
      });
      
      showMessage('Priest assigned successfully!', 'success');
      setShowAssignModal(false);
      setSelectedPriest(null);
      setSelectedParish(null);
      fetchData();
    } catch (error) {
      console.error('Error assigning priest:', error);
      showMessage('Failed to assign priest', 'error');
    }
  };

  const handleUnassign = async (priestId: number, priestName: string) => {
    if (!confirm(`Are you sure you want to remove ${priestName} from their parish?`)) {
      return;
    }

    try {
      await api.post(`/priests/unassign/${priestId}`);
      showMessage('Priest unassigned successfully!', 'success');
      fetchData();
    } catch (error) {
      console.error('Error unassigning priest:', error);
      showMessage('Failed to unassign priest', 'error');
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gold animate-pulse">Loading priest data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
 {/* Header */}
<div className="flex justify-between items-center">
  <h2 className="text-xl font-display text-foreground">Priest Management</h2>
  <div className="flex gap-2">
    <button
      onClick={() => setShowCreateModal(true)}
      className="btn-gold !py-2 !px-4 !text-sm flex items-center gap-2 whitespace-nowrap" 
    >
      <UserPlus size={16} />
      <span>Create Priest</span>
    </button>
    <button
      onClick={() => setShowAssignModal(true)}
      className="btn-gold !py-2 !px-4 !text-sm flex items-center gap-2 whitespace-nowrap" 
      disabled={unassignedPriests.length === 0 || vacantParishes.length === 0}
    >
      <UserPlus size={16} />
      <span>Assign Priest</span>
    </button>
  </div>
</div>

      {/* Message */}
      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/20 border-green-500/30' : 'bg-destructive/20 border-destructive/30'
        } border`}>
          <p className="text-sm text-foreground">{message.text}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-2xl font-display text-primary">{priests.length}</div>
            <div className="text-xs text-muted-foreground font-ui">Total Priests</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <User className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-2xl font-display text-primary">{unassignedPriests.length}</div>
            <div className="text-xs text-muted-foreground font-ui">Unassigned Priests</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Home className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-2xl font-display text-primary">{vacantParishes.length}</div>
            <div className="text-xs text-muted-foreground font-ui">Vacant Parishes</div>
          </div>
        </div>
      </div>

      {/* Assigned Priests List */}
      <div className="glass-card">
        <h3 className="text-lg font-display text-foreground mb-4">Assigned Priests</h3>
        <div className="space-y-3">
          {priests.filter(p => p.parish_id).length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No priests assigned</p>
          ) : (
            priests.filter(p => p.parish_id).map((priest) => {
              const parish = allParishes.find(p => p.id === priest.parish_id);
              return (
                <div key={priest.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-display text-sm text-foreground">
                        Fr. {priest.first_name} {priest.last_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Church size={12} className="text-gold" />
                        <span className="text-xs text-muted-foreground">{parish?.name}</span>
                        <MapPin size={12} className="text-gold ml-1" />
                        <span className="text-xs text-muted-foreground">{parish?.location}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnassign(priest.id, `Fr. ${priest.first_name} ${priest.last_name}`)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove from parish"
                  >
                    <UserMinus size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

{/* Unassigned Priests List */}
<div className="glass-card">
  <h3 className="text-lg font-display text-foreground mb-4">Unassigned Priests</h3>
  <div className="space-y-3">
    {unassignedPriests.length === 0 ? (
      <p className="text-center text-muted-foreground py-4">No unassigned priests</p>
    ) : (
      unassignedPriests.map((priest) => (
        <div key={priest.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <User className="w-5 h-5 text-gold" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-display text-sm text-foreground">
                Fr. {priest.first_name} {priest.last_name}
              </h4>
              <p className="text-xs text-muted-foreground">{priest.email}</p>
            </div>
          </div>
<button
  onClick={() => {
    setSelectedPriest(priest.id);
    setShowAssignModal(true);
  }}
  className="btn-gold !py-1 !px-2 !text-[0.65rem] whitespace-nowrap min-w-[60px] max-w-md text-center"
  disabled={vacantParishes.length === 0}
>
  Assign Priest
</button>
        </div>
      ))
    )}
  </div>
</div>

      {/* Create Priest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-display text-foreground">Create New Priest</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePriest} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPriest.first_name}
                    onChange={(e) => setNewPriest({...newPriest, first_name: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPriest.last_name}
                    onChange={(e) => setNewPriest({...newPriest, last_name: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newPriest.username}
                  onChange={(e) => setNewPriest({...newPriest, username: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="fr.johndoe"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newPriest.email}
                  onChange={(e) => setNewPriest({...newPriest, email: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="fr.john@parish.org"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newPriest.password}
                  onChange={(e) => setNewPriest({...newPriest, password: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Assign to Parish (Optional)
                </label>
                <select
                  value={newPriest.parish_id}
                  onChange={(e) => setNewPriest({...newPriest, parish_id: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Unassigned</option>
                  {allParishes.map(parish => (
                    <option key={parish.id} value={parish.id}>
                      {parish.name} - {parish.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-gold"
                >
                  Create Priest
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-display text-foreground">Assign Priest to Parish</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Select Priest */}
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  Select Priest
                </label>
                <select
                  value={selectedPriest || ''}
                  onChange={(e) => setSelectedPriest(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
                >
                  <option value="">Choose a priest...</option>
                  {unassignedPriests.map(priest => (
                    <option key={priest.id} value={priest.id}>
                      Fr. {priest.first_name} {priest.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Parish */}
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  Select Parish
                </label>
                <select
                  value={selectedParish || ''}
                  onChange={(e) => setSelectedParish(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
                >
                  <option value="">Choose a parish...</option>
                  {vacantParishes.map(parish => (
                    <option key={parish.id} value={parish.id}>
                      {parish.name} - {parish.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAssign}
                  disabled={!selectedPriest || !selectedParish}
                  className="flex-1 btn-gold disabled:opacity-50"
                >
                  Assign Priest
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriestManagement;