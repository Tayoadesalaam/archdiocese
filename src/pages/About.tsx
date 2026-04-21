import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, Cross, Bird, Building, Users, Map } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Cathedral Background */}
      <div className="cathedral-bg" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-float-in">
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            About the Archdiocese of Abuja
          </h1>
          <p className="text-muted-foreground font-ui text-sm max-w-2xl mx-auto">
            A community of faith, hope, and love since 1981
          </p>
        </div>

        {/* History Card */}
        <div className="glass-card mb-6 animate-float-in-delay-1">
          <div className="flex items-start gap-4">
            <ScrollText className="w-8 h-8 text-gold flex-shrink-0" strokeWidth={1.5} />
            <div>
              <h2 className="font-display text-xl text-foreground mb-3">Our History</h2>
              <p className="text-muted-foreground font-ui text-sm leading-relaxed">
                The Catholic Archdiocese of Abuja was established in 1981 and has since grown 
                to become a vibrant faith community serving the Federal Capital Territory and 
                beyond. Under the guidance of our shepherds, we continue to spread the Gospel 
                and serve our neighbors in love.
              </p>
              <p className="text-muted-foreground font-ui text-sm leading-relaxed mt-3">
                What began as a small missionary outpost has flourished into over 50 parishes, 
                serving hundreds of thousands of faithful across the region.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card animate-float-in-delay-2">
            <div className="flex items-start gap-3">
              <Cross className="w-8 h-8 text-gold flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h2 className="font-display text-xl text-foreground mb-3">Our Mission</h2>
                <p className="text-muted-foreground font-ui text-sm leading-relaxed">
                  To proclaim the Good News of Jesus Christ, celebrate the sacraments, and serve 
                  the people of God through education, healthcare, and social services.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card animate-float-in-delay-2">
            <div className="flex items-start gap-3">
              <Bird className="w-8 h-8 text-gold flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h2 className="font-display text-xl text-foreground mb-3">Our Vision</h2>
                <p className="text-muted-foreground font-ui text-sm leading-relaxed">
                  A Church that is truly a family of families, where faith comes alive and love 
                  transforms lives, reaching out to all with compassion and mercy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="glass-card mb-6 animate-float-in-delay-3">
          <h2 className="font-display text-xl text-foreground mb-6 text-center">Archdiocese at a Glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '52', label: 'Parishes', icon: Building },
              { value: '124', label: 'Priests', icon: Users },
              { value: '12', label: 'Deaneries', icon: Map },
              { value: '8', label: 'Institutions', icon: Building },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center p-3 rounded-lg bg-secondary/20 border border-border/30">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-gold" strokeWidth={1.5} />
                  <div className="text-2xl font-display text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-ui">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership Section */}
        <div className="glass-card animate-float-in-delay-4">
          <h2 className="font-display text-xl text-foreground mb-6 text-center">Our Shepherds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border border-border/30">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-xl text-gold">JD</span>
              </div>
              <div>
                <h3 className="font-display text-base text-foreground">Most Rev. John Doe</h3>
                <p className="text-xs text-muted-foreground font-ui">Archbishop of Abuja</p>
                <p className="text-xs text-gold mt-1">Since 2015</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border border-border/30">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-xl text-gold">MS</span>
              </div>
              <div>
                <h3 className="font-display text-base text-foreground">Rt. Rev. Michael Smith</h3>
                <p className="text-xs text-muted-foreground font-ui">Auxiliary Bishop</p>
                <p className="text-xs text-gold mt-1">Since 2018</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8 animate-float-in-delay-4">
          <Link to="/parishes" className="btn-gold inline-flex items-center gap-2">
            <span>Find a Parish Near You</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;