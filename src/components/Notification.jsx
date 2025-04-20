import React from "react";

const Notification = ({ message, type }) => {
  return (
    <div className={`notification ${type} p-4 mb-4`}>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
