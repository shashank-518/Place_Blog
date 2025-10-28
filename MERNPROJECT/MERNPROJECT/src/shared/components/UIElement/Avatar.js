import React from "react";
import "./Avatar.css";

const Avatar = ({ image, alt, width = "80px", className = "", style }) => {
  return (
    <div
      className={`avatar ${className}`}
      style={{ width, height: width, ...style }}
    >
      <img src={image} alt={alt} loading="lazy" />
    </div>
  );
};

export default Avatar;
