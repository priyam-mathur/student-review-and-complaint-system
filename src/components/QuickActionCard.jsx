import React from "react";
import { Link } from "react-router-dom";

const QuickActionCard = ({ to, title, description, color }) => {
  return (
    <Link
      to={to}
      className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-white ${color}`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default QuickActionCard;
