import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Church } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/50 bg-background/60 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Church className="w-5 h-5 text-gold" strokeWidth={1.5} />
              <h3 className="font-display text-sm text-foreground">
                Archdiocese of Abuja
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Working together for the Kingdom of God
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-ui uppercase tracking-wider text-muted-foreground mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['About', 'Parishes', 'Events', 'Contact'].map(l => (
                <li key={l}>
                  <Link
                    to={`/${l.toLowerCase()}`}
                    className="text-xs font-ui text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-ui uppercase tracking-wider text-muted-foreground mb-3">
              Contact
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-xs font-ui text-muted-foreground">
                  Catholic Secretariat<br />Area 11, Garki, Abuja
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gold flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs font-ui text-muted-foreground">+234 (0) 803 123 4567</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs font-ui text-muted-foreground">info@abujaarchdiocese.org</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-ui uppercase tracking-wider text-muted-foreground mb-3">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 py-4 text-center">
        <p className="text-[0.65rem] font-ui text-muted-foreground">
          © {new Date().getFullYear()} Archdiocese of Abuja. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;