import React, { useState, useEffect } from 'react';
import '../styles/nav.css';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const StackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 12 12 17 22 12"/>
    <polyline points="2 17 12 22 22 17"/>
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const EnvelopeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const SECTIONS = ['about', 'projects', 'skills', 'contact'];

export default function Nav() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of SECTIONS) {
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
    handleScroll();

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

  const renderNavLink = (sectionId, IconComponent) => {
    const isCurrent = activeSection === sectionId;
    const linkClass = isCurrent ? "nav-link current" : "nav-link";
    const pageTitle = getPageTitle(sectionId);

    return (
      <a 
        href={`#${sectionId}`} 
        className={linkClass}
        onClick={(e) => scrollToSection(e, sectionId)}
      >
        <IconComponent />
        {isCurrent && <h1 className="page-title">{pageTitle}</h1>}
      </a>
    );
  };

  return (
    <nav className="nav"> 
      {renderNavLink("about", UserIcon)}
      {renderNavLink("projects", StackIcon)}
      {renderNavLink("skills", TargetIcon)}
      {renderNavLink("contact", EnvelopeIcon)}
    </nav>
  );
}
