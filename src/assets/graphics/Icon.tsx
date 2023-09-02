import React from 'react';
import './logo.scss';
const icon = require("./red_icon.svg") as string;

const Icon = () => (
  <img src={icon}></img>

  // <div className="icon">
  //   <img
  //     src="https://storage.googleapis.com/currynomics/logo_white.png"
  //     alt="Redcurry"
  //   />
  // </div>
);

export default Icon;

