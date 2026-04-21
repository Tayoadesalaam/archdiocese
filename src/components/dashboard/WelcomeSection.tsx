import React from 'react';

interface WelcomeSectionProps {
  title: string;
  subtitle: string;
  badgeText: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ title, subtitle, badgeText }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 animate-float-in py-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-medium text-foreground tracking-tight mb-0.5">
          {title}
        </h1>
        <p className="text-muted-foreground font-ui text-sm">{subtitle}</p>
      </div>
      <div className="badge-gold whitespace-nowrap">
        {badgeText}
      </div>
    </div>
  );
};

export default WelcomeSection;
