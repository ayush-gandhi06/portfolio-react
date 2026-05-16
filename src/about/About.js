import React, { Component } from 'react';
import Avatar from "../avatar/Avatar.js";
import AboutMenu from "./AboutMenu.js";
import CadViewer from "../components/CadViewer.jsx";

export default class About extends Component {
  render() {
    return (
      <div className="about-page" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <Avatar page="about" />
            <AboutMenu />
          </div>
        </div>
        <CadViewer />
      </div>
    );
  }
}
