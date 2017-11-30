import React, { Component } from 'react';
import logoSrc from ".././static/images/logo.png";
import './Header.css';

class Header extends Component {
  render() {
    return (
        <header className="Header-header">
          <img src={logoSrc} className="Header-logo" alt="logo" />
          <h1 className="Header-title">Music Player Build By React</h1>
          <hr />
        </header>
    );
  }
}

export default Header;
