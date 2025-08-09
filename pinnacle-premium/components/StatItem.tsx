
import React from 'react';

interface StatItemProps {
  value: string;
  label: string;
  positive?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, positive }) => {
  const valueColor = positive ? 'text-green-500' : 'text-indigo-600';

  return (
    <div className="text-center p-4 bg-gray-50/50 rounded-xl transition-transform duration-300 hover:scale-105">
      <div className={`text-2xl font-bold ${valueColor} mb-1`}>{value}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
};

export default StatItem;
