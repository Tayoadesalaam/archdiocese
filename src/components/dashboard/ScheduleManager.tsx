import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface ScheduleManagerProps {
  parishId: number;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ parishId }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    event_type: 'worship'
  });

  useEffect(() => {
    fetchSchedule();
  }, [parishId]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const eventsData = await getEvents({ parish_id: parishId });
      const sorted = eventsData.sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sorted);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        ...formData,
        parish_id: parishId,
        date: new Date(formData.date).toISOString(),
        is_archdiocesan: false
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }

      fetchSchedule();
      setShowForm(false);
      setEditingEvent(null);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        fetchSchedule();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date.split('T')[0],
      time: event.time || '',
      location: event.location || '',
      event_type: event.event_type
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      event_type: 'worship'
    });
  };

  const getDayOfWeek = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gold animate-pulse">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display text-foreground">Parish Schedule</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn-gold !py-2 !px-4 !text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-secondary/20 rounded-lg border border-border/40">
          <h3 className="text-lg font-display text-foreground mb-4">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., Sunday Mass"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Event Type
                </label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="worship">Worship</option>
                  <option value="formation">Formation</option>
                  <option value="youth">Youth</option>
                  <option value="music">Music</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., Main Church, Parish Hall"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground font-ui mb-1 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Additional details..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 btn-gold !py-2"
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Display */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No events scheduled</p>
            <p className="text-xs text-muted-foreground mt-2">Click "Add Event" to create your parish schedule</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="p-3 bg-secondary/20 rounded-lg border border-border/40 hover:border-gold/30 transition-colors">
              <div className="flex items-start gap-3">
                {/* Date Badge */}
                <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg border border-gold/20 flex flex-col items-center justify-center">
                  <span className="text-[0.6rem] text-gold font-ui uppercase">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-base font-display text-gold">
                    {new Date(event.date).getDate()}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-sm text-foreground">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                    </div>
                    <span className="text-[0.6rem] bg-secondary/50 px-2 py-1 rounded-full text-muted-foreground">
                      {event.event_type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-gold" />
                      <span className="text-[0.6rem] text-muted-foreground">
                        {getDayOfWeek(event.date)}
                      </span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-1">
                        <Clock size={10} className="text-gold" />
                        <span className="text-[0.6rem] text-muted-foreground">{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={10} className="text-gold" />
                        <span className="text-[0.6rem] text-muted-foreground">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleManager;