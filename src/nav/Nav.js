/*\"this is my naiguation bar at the top of the page. I need it to go around my website. Its better than using tags because this way, using the react plateform, i dont need to refressh my browser. it makes it feel much smoother and more like  an app."*/


import React from 'react'
import {Link, useLocation} from 'react-router-dom'
import ThemeToggle from '../theme/ThemeToggle'
import astraunautHelmet from '../assets/astronaut-helmet.png'
import deadEye from '../assets/dead-eye.png'
import stack from '../assets/stack.png'
import envelope from '../assets/envelope.png'
import '../styles/nav.css'

export default function Nav() {
  const location = useLocation();
  const getNavPositionClass = () => {
    switch(location.pathname) {
      case '/':
        return "nav-about"
      case '/skills':
        return "nav-skills"
      case '/projects':
        return "nav-projects"
      case '/contact':
        return "nav-contact"
      default:
        return ""
    }
  };

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/':
        return "ABOUT"
      case '/skills':
        return "SKILLS"
      case '/projects':
        return "PROJECTS"
      case '/contact':
        return "CONTACT"
      default:
        return ""
    }

  };

  const navPositionClass = getNavPositionClass();
  const pageTitle = getPageTitle(); 







  const isCurrentPage = (navClass)=> {
    return (navClass===navPositionClass)  
  };

  const renderNavLink= ( to, imgSrc, altText, navClass) => {
    const isCurrent= isCurrentPage(navClass);
    const linkClass = isCurrent ? "nav-link current" :"nav-link"
    

    return (
      <Link to={to} className={linkClass}>
        <img src = {imgSrc} alt={altText}/>
        {isCurrent && <h1 className= "page-title">{pageTitle}
        </h1>}
    
      </Link>
    );
  };
  
    return (
      <>
      <nav className={`nav ${navPositionClass}`}> 
        {renderNavLink( "/", astraunautHelmet,"astraunaut helmet icon","nav-about")}
        {renderNavLink("/skills", deadEye, "dead eye icon", "nav-skills")}
        {renderNavLink("/projects", stack, "stack icon", "nav-projects" )}
        {renderNavLink( "/contact",envelope, "envelope icon", "nav-contact")}
      </nav>
      <ThemeToggle />
      </>
    );
  };
