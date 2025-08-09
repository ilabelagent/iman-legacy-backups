
import React, { ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl shadow-black/10 transition-all duration-300 hover:shadow-black/20 hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
};

export default DashboardCard;
