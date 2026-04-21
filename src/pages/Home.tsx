import React from 'react';
import { Link } from 'react-router-dom';
import { Church, Users, BookOpen, Heart } from 'lucide-react';

const features = [
  { icon: Church, title: 'Faith Formation', desc: 'Deepen your faith through our programs' },
  { icon: Users, title: 'Community', desc: 'Join a vibrant faith community' },
  { icon: BookOpen, title: 'Education', desc: 'Catholic schools and formation centers' },
  { icon: Heart, title: 'Charity', desc: 'Serving those in need' },
];

const Home: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[70vh] px-4">
        <div className="cathedral-bg" />
        <div className="relative text-center max-w-xl animate-float-in">
          <h1 className="text-3xl sm:text-4xl font-display tracking-tight mb-3 text-foreground">
            Welcome to the Archdiocese of Abuja
          </h1>
          <p className="text-sm text-muted-foreground font-ui mb-8 leading-relaxed">
            One Faith, One Family, One Future in Christ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/about" className="btn-gold !w-auto !px-6">
              Learn More
            </Link>
            <Link
              to="/parishes"
              className="px-6 py-2.5 rounded-lg text-xs font-ui text-muted-foreground border border-border/50 hover:bg-secondary/50 transition-colors"
            >
              Find a Parish
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-xl text-center mb-10 text-foreground animate-float-in-delay-1">
          Our Mission
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`glass-card text-center animate-float-in-delay-${i + 1}`}
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-gold" strokeWidth={1.5} />
                <h3 className="font-display text-sm text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground font-ui">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-md mx-auto px-4 sm:px-6 pb-16 text-center animate-float-in-delay-3">
        <div className="glass-card">
          <h2 className="font-display text-lg text-foreground mb-2">
            Join Our Faith Community
          </h2>
          <p className="text-xs text-muted-foreground font-ui mb-5">
            Register today to stay connected with your parish
          </p>
          <Link to="/login" className="btn-gold !w-auto !px-8 inline-block">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;