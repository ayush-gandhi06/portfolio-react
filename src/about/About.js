import React, { Component } from 'react';
import Avatar from "../avatar/Avatar.js";
import AboutMenu from "./AboutMenu.js";
import CadViewer from "../components/CadViewer.jsx";
import PlayerStats from "../playerStats/PlayerStats.js";
import "../styles/aboutMenu.css";

export default class About extends Component {
  render() {
    return (
      <div className="about-page about-page-wrapper">
        {/* Desktop: inner layer holds all absolutely-positioned content */}
        <div className="about-page-inner">
          <PlayerStats />
          <Avatar page="about" />
          <AboutMenu />
        </div>
        {/* CAD Viewer: top-left on desktop, inline on mobile via CSS */}
        <CadViewer />
      </div>
    );
  }
}
