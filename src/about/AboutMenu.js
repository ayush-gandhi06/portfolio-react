import React,{ Component } from "react";
import AboutMenuItem from "./AboutMenuItems.js"
import AboutSubheading from "./AboutSubheading.js"
import AboutSocialLinks from "./AboutSocialLinks";
import subheadingsData from "./subheadingsData.js"

const PersonalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon" style={{ width: "2.45rem", height: "2.75em", marginTop: "-15px" }}>
    <path d="M12 2L2 22h20L12 2z"/>
    <path d="M12 10l-4 8h8l-4-8z"/>
  </svg>
);

const EducationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon" style={{ width: "2.45rem", height: "2.75em", marginTop: "-15px" }}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const CareerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon" style={{ width: "2.45rem", height: "2.75em", marginTop: "-15px" }}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

export default class AboutMenu  extends Component {
    constructor (props){
        super(props);
        this.state = {
            activeMenuItem:1,
            activeSubheading:1,
            
        };
    }

    handleMenuItemClick = (menuItem) =>{
        this.setState({
            activeMenuItem:menuItem,
            activeSubheading:1,
        });
    };

    handleSubheadingClick = (subheading) =>{
        this.setState({
            activeSubheading:subheading,
        });
    };
        
    
    render() {

        const{activeMenuItem, activeSubheading} = this.state;
        const menuItems =["PERSONAL", "EDUCATION", "RESUME"];
        const activeMenuTitle = menuItems[activeMenuItem -1];
        const ActiveMenuIcon =
            activeMenuTitle==="PERSONAL"? PersonalIcon
            : activeMenuTitle==="EDUCATION"? EducationIcon
            : CareerIcon;

      
        const subheadings = subheadingsData[activeMenuItem] || [];

        return (
  <>
    <div className="menu">
      {menuItems.map((item, index) => (
        <AboutMenuItem
          key={index}
          title={item}
          active={activeMenuItem === index + 1}
          onClick={() => this.handleMenuItemClick(index + 1)}
        />
      ))}
    </div>
    <div className="sub-container">
      <div className="icon-title-container">
        <ActiveMenuIcon />
        <h3>{activeMenuTitle}</h3>
      </div>
      <AboutSocialLinks />
      {subheadings.map((subheading, index) => (
        <AboutSubheading
          key={index}
          title={subheading.title}
          content={subheading.content}
          active={activeSubheading === index + 1}
          onClick={() => this.handleSubheadingClick(index + 1)}
          menuItem={activeMenuItem}
        />
      ))}
      {activeMenuTitle === "RESUME" && (
        <a href="Ayush_1B.pdf" download="ayushGandhi_Resume.pdf" className="btn-resume">
          ↓ CHECK OUT MY RESUME
        </a>
      )}
    </div>
  </>
);
    }
}

