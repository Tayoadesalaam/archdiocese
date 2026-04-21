import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createSacramentRecord } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface SacramentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const sacramentTypes = [
  { value: 'BAPTISM', label: 'Baptism' },
  { value: 'CONFIRMATION', label: 'Confirmation' },
  { value: 'FIRST_COMMUNION', label: 'First Holy Communion' },
  { value: 'MARRIAGE', label: 'Marriage' },
  { value: 'HOLY_ORDERS', label: 'Holy Orders' },
  { value: 'ANOINTING', label: 'Anointing of the Sick' }
];

const SacramentModal: React.FC<SacramentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Log user data to debug
  useEffect(() => {
    if (user) {
      console.log('SacramentModal - Current user:', user);
      console.log('SacramentModal - Parish ID:', user.parishId);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    member_name: '',
    sacrament_type: 'BAPTISM',
    date_received: '',
    parish_id: user?.parishId || null  // This will be set from user
  });

  // Update formData when user changes
  useEffect(() => {
    if (user?.parishId) {
      setFormData(prev => ({ ...prev, parish_id: user.parishId }));
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate parish_id
      if (!formData.parish_id) {
        alert('Error: No parish assigned to this user');
        setLoading(false);
        return;
      }

      // Format date exactly like the working curl command
      const dateStr = `${formData.date_received}T00:00:00`;
      
      const requestData = {
        member_name: formData.member_name,
        sacrament_type: formData.sacrament_type,
        date_received: dateStr,
        parish_id: Number(formData.parish_id)  // Ensure it's a number
      };
      
      console.log('Sending data with parish_id:', requestData.parish_id);
      
      const response = await createSacramentRecord(requestData);
      console.log('Success! Response:', response);
      
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        member_name: '',
        sacrament_type: 'BAPTISM',
        date_received: '',
        parish_id: user?.parishId || null
      });
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
        alert(`Error: ${error.response.data.detail || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't show modal if user has no parish
  if (!user?.parishId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="glass-card max-w-md w-full p-6 text-center">
          <h2 className="text-xl font-display text-foreground mb-4">Cannot Add Sacrament</h2>
          <p className="text-muted-foreground mb-4">You are not assigned to a parish.</p>
          <button onClick={onClose} className="btn-gold">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display text-foreground">Add Sacrament Record</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Member Name
            </label>
            <input
              type="text"
              required
              value={formData.member_name}
              onChange={(e) => setFormData({...formData, member_name: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
              placeholder="Full name of person"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Sacrament Type
            </label>
            <select
              value={formData.sacrament_type}
              onChange={(e) => setFormData({...formData, sacrament_type: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
            >
              {sacramentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Date Received
            </label>
            <input
              type="date"
              required
              value={formData.date_received}
              onChange={(e) => setFormData({...formData, date_received: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
            />
          </div>

          {/* Hidden field for debugging - can remove later */}
          <div className="text-xs text-muted-foreground">
            Parish ID: {formData.parish_id || 'Not set'}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-gold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SacramentModal;