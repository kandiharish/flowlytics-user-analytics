import React from 'react';

const MetricCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-center transition-all hover:shadow-md">
      <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;
