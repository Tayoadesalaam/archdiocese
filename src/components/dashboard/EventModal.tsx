import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createEvent } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    event_type: 'general',
    is_archdiocesan: user?.role === 'ARCHBISHOP' ? true : false,
    parish_id: user?.parishId || null
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEvent({
        ...formData,
        date: new Date(formData.date).toISOString()
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        event_type: 'general',
        is_archdiocesan: user?.role === 'ARCHBISHOP',
        parish_id: user?.parishId || null
      });
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display text-foreground">Schedule New Event</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui resize-none"
              placeholder="Describe the event"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
              placeholder="Event location"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Event Type
            </label>
            <select
              value={formData.event_type}
              onChange={(e) => setFormData({...formData, event_type: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
            >
              <option value="general">General</option>
              <option value="worship">Worship</option>
              <option value="youth">Youth</option>
              <option value="clergy">Clergy</option>
            </select>
          </div>

          {user?.role === 'ARCHBISHOP' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="archdiocesan"
                checked={formData.is_archdiocesan}
                onChange={(e) => setFormData({...formData, is_archdiocesan: e.target.checked})}
                className="rounded border-border bg-secondary/50"
              />
              <label htmlFor="archdiocesan" className="text-xs text-muted-foreground font-ui">
                Archdiocesan-wide event (visible to all parishes)
              </label>
            </div>
          )}

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
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;