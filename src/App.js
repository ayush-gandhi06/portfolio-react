import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import ThemeToggle from "./theme/ThemeToggle";
import Nav from "./nav/Nav.js";
import About from "./about/About.js";
import Skills from "./skills/Skills.js";
import Projects from "./projects/Projects.js";
import Contact from "./contact/Contact.js";
import "./styles/app.css";
import Background from "./background/Background.js";
import PlayerStats from "./playerStats/PlayerStats.js";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <ThemeToggle />
        <Nav />
        <Background />
        <main className="app-main">
          <section id="about" className="page-section"><About /></section>
        <section id="projects" className="page-section"><Projects /></section>
        <section id="skills" className="page-section"><Skills /></section>
        <section id="contact" className="page-section"><Contact /></section>
      </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
