import React from 'react';
import { Users, FileText, Mail, BarChart, Clock, Calendar, Heart, Phone, Church } from 'lucide-react';

interface ActionItem {
  icon: keyof typeof iconMap;
  label: string;
  onClick?: () => void;  // Add onClick handler
}

interface QuickActionsCardProps {
  heading: string;
  actions: ActionItem[];
  animDelay?: string;
}

const iconMap = {
  'users': Users,
  'file-text': FileText,
  'mail': Mail,
  'bar-chart': BarChart,
  'clock': Clock,
  'calendar': Calendar,
  'heart': Heart,
  'phone': Phone,
  'chapel': Church,
};

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ heading, actions, animDelay = '' }) => {
  return (
    <div className={`glass-card ${animDelay}`}>
      <h3 className="text-lg font-display font-medium text-foreground mb-4">{heading}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map((action, i) => {
          const Icon = iconMap[action.icon];
          return (
            <div
              key={i}
              onClick={action.onClick}  // Add onClick handler here
              className="flex flex-col items-center gap-1.5 p-3 rounded-md bg-secondary/20 border border-border/30 hover:bg-secondary/35 transition-colors cursor-pointer group"
            >
              <Icon className="w-5 h-5 text-gold group-hover:text-gold/80" strokeWidth={1.5} />
              <span className="text-muted-foreground font-ui text-[0.7rem] text-center group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsCard;