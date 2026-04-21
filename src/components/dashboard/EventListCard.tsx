import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface EventItem {
  id?: number;
  title: string;
  subtitle: string;
  badge?: string;
}

interface EventListCardProps {
  heading: string;
  linkText?: string;
  linkTo?: string;
  items: EventItem[];
  actionLabel: string;
  onAction?: () => void;
  animDelay?: string;
}

const EventListCard: React.FC<EventListCardProps> = ({ 
  heading, 
  linkText, 
  linkTo,
  items, 
  actionLabel, 
  onAction,
  animDelay = '' 
}) => {
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  return (
    <div className={`glass-card ${animDelay}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-display font-medium text-foreground">{heading}</h3>
        {linkText && linkTo && (
          <button
            onClick={handleLinkClick}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary text-xs font-ui transition-colors"
          >
            <span>{linkText}</span>
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div
            key={item.id || i}
            className="flex justify-between items-center p-2.5 rounded-md bg-secondary/30 border border-border/40 hover:bg-secondary/40 transition-colors"
          >
            <div>
              <h4 className="text-foreground text-sm font-medium mb-0.5">{item.title}</h4>
              <p className="text-muted-foreground font-ui text-xs">{item.subtitle}</p>
            </div>
            {item.badge && (
              <span className="badge-gold hidden sm:inline-block">{item.badge}</span>
            )}
          </div>
        ))}
      </div>
      
      <button 
        className="btn-gold w-full mt-4"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default EventListCard;