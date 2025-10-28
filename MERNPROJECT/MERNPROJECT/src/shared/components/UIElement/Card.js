import React from "react";
import "./Card.css";

const Card = ({ children, className = "", style }) => {
  return (
    <div className={`card ${className}`} style={style}>
      <div className="card__glow"></div>
      {children}
    </div>
  );
};

export default Card;
