import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, delay = 0 }) => {
  const delayClass = delay === 0 ? 'animate-float-in' : 
    delay === 1 ? 'animate-float-in-delay-1' :
    delay === 2 ? 'animate-float-in-delay-2' :
    'animate-float-in-delay-3';

  return (
    <div className={`glass-card ${delayClass}`}>
      <div className="text-2xl font-medium font-display text-primary mb-0.5 leading-none">
        {value}
      </div>
      <div className="text-muted-foreground font-ui text-[0.7rem] uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
