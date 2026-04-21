import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createAnnouncement } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    parish_id: user?.role === 'ARCHBISHOP' ? null : user?.parishId
  });

  useEffect(() => {
    // Reset form when user changes
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      parish_id: user?.role === 'ARCHBISHOP' ? null : user?.parishId
    });
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        parish_id: formData.parish_id
      };
      
      console.log('Creating announcement:', requestData);
      
      await createAnnouncement(requestData);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      alert(error.response?.data?.detail || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display text-foreground">Compose Announcement</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
              placeholder="Announcement title"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
              Content
            </label>
            <textarea
              required
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui resize-none"
              placeholder="Write your announcement..."
            />
          </div>

          {user?.role === 'ARCHBISHOP' && (
            <>
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                  Audience
                </label>
                <select
                  value={formData.parish_id || ''}
                  onChange={(e) => setFormData({...formData, parish_id: e.target.value ? Number(e.target.value) : null})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui"
                >
                  <option value="">All Parishes (Archdiocesan-wide)</option>
                  <option value="1">Our Lady Queen of Nigeria</option>
                  {/* Add more parishes as needed */}
                </select>
              </div>
            </>
          )}

          {user?.role === 'PRIEST' && (
            <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
              This announcement will be sent to your parish only.
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
              {loading ? 'Sending...' : 'Send Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;