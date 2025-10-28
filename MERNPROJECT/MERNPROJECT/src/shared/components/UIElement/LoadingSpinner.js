import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ asOverlay }) => {
  return (
    <div className={`loading-spinner ${asOverlay ? "loading-spinner--overlay" : ""}`}>
      <div className="loading-spinner__circle" role="status"></div>
    </div>
  );
};

export default LoadingSpinner;
