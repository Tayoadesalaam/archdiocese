import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent! (demo)');
  };

  return (
    <div className="relative min-h-screen">
      <div className="cathedral-bg" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-float-in">
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            Contact Us
          </h1>
          <p className="text-muted-foreground font-ui text-sm max-w-2xl mx-auto">
            Get in touch with the Archdiocesan Secretariat
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {/* Address Card */}
            <div className="glass-card animate-float-in-delay-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-base text-foreground mb-2">Visit Us</h3>
                  <p className="text-xs text-muted-foreground font-ui leading-relaxed">
                    Catholic Secretariat<br />
                    Area 11, Garki<br />
                    Abuja, FCT<br />
                    Nigeria
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="glass-card animate-float-in-delay-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-base text-foreground mb-2">Call Us</h3>
                  <p className="text-xs text-muted-foreground font-ui">+234 (0) 803 123 4567</p>
                  <p className="text-xs text-muted-foreground font-ui">+234 (0) 809 876 5432</p>
                  <p className="text-xs text-gold mt-2">Mon-Fri: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="glass-card animate-float-in-delay-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-base text-foreground mb-2">Email Us</h3>
                  <p className="text-xs text-muted-foreground font-ui">info@abujaarchdiocese.org</p>
                  <p className="text-xs text-muted-foreground font-ui">secretariat@abujaarchdiocese.org</p>
                  <p className="text-xs text-gold mt-2">We reply within 24-48 hours</p>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="glass-card animate-float-in-delay-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-base text-foreground mb-2">Office Hours</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-ui">Monday - Friday:</span>
                      <span className="text-foreground font-ui">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-ui">Saturday:</span>
                      <span className="text-foreground font-ui">9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-ui">Sunday:</span>
                      <span className="text-foreground font-ui">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card animate-float-in-delay-2">
              <h2 className="font-display text-xl text-foreground mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-ui mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-ui placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    placeholder="Type your message here..."
                    required
                  />
                </div>

                <button type="submit" className="btn-gold flex items-center justify-center gap-2">
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="glass-card mt-4 animate-float-in-delay-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base text-foreground">Find Us</h3>
                <span className="text-xs text-gold">Catholic Secretariat, Garki</span>
              </div>
              <div className="h-48 bg-secondary/30 rounded-lg border border-border/50 flex items-center justify-center">
                <p className="text-xs text-muted-foreground font-ui">Google Maps Integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;