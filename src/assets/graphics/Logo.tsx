import React from 'react';
import './logo.scss';
const logo = require("./red_logo.svg") as string;

const Logo = () => (
  <img src={logo}></img>

  // <div className="logo">
  //   <img
  //     src="https://storage.googleapis.com/currynomics/logo_white.png"
  //     alt="Redcurry Logo"
  //   />
  // </div>
);

export default Logo;

