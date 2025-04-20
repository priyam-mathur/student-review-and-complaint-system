import React from "react";

const StatsCard = ({ title, count, color }) => {
  return (
    <div className={`bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow border-l-4 ${color}`}>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      <p className="text-4xl font-bold">{count}</p>
    </div>
  );
};

export default StatsCard;
