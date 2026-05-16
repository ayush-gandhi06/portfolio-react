import React, { useState, useEffect } from 'react';
//import ThemeToggle from '../theme/ThemeToggle';
import astraunautHelmet from '../assets/astronaut-helmet.png';
import deadEye from '../assets/dead-eye.png';
import stack from '../assets/stack.png';
import envelope from '../assets/envelope.png';
import '../styles/nav.css';

export default function Nav() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPageTitle = (section) => {
    switch(section) {
      case 'about': return "ABOUT";
      case 'skills': return "SKILLS";
      case 'projects': return "PROJECTS";
      case 'contact': return "CONTACT";
      default: return "";
    }
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderNavLink = (sectionId, imgSrc, altText) => {
    const isCurrent = activeSection === sectionId;
    const linkClass = isCurrent ? "nav-link current" : "nav-link";
    const pageTitle = getPageTitle(sectionId);

    return (
      <a 
        href={`#${sectionId}`} 
        className={linkClass}
        onClick={(e) => scrollToSection(e, sectionId)}
      >
        <img src={imgSrc} alt={altText}/>
        {isCurrent && <h1 className="page-title">{pageTitle}</h1>}
      </a>
    );
  };

  return (
    <>
      <nav className="nav"> 
        {renderNavLink("about", astraunautHelmet, "astraunaut helmet icon")}
        {renderNavLink("skills", deadEye, "dead eye icon")}
        {renderNavLink("projects", stack, "stack icon")}
        {renderNavLink("contact", envelope, "envelope icon")}
      </nav>
      {/* ThemeToggle has been moved to App.js directly but we can keep it here if preferred. 
          Actually, we already added it to App.js, so we don't need it here to avoid duplication. */}
    </>
  );
}
