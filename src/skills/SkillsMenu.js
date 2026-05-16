import React, { Component, createRef } from "react";
import "../styles/skillsMenu.css";

const skillsData = [
  {
    category: "Software & Tools",
    skills: ["Python", "C++", "MediaPipe", "OpenCV", "PyTorch", "Matplotlib", "NumPy", "MS Office", "JS", "HTML"]
  },
  {
    category: "Hardware & Tools",
    skills: ["SolidWorks", "Onshape", "Fusion360", "AutoCAD", "Arduino", "ESP32", "Ultrasonic Sensors", "Motors", "Drivers"]
  },
  {
    category: "Production",
    skills: ["CAD", "Rapid Prototyping", "3D printing", "Milling Machine", "Lathe", "DFM", "GD&T"]
  },
  {
    category: "Languages",
    skills: ["English", "French", "Hindi", "Gujarati"]
  }
];

export default class SkillsMenu extends Component {
  constructor(props) {
    super(props);
    this.pageRef = createRef();
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.pageRef.current.classList.add("visible");
        } else {
          this.pageRef.current.classList.remove("visible");
        }
      },
      { threshold: 0.1 }
    );
    if (this.pageRef.current) {
      this.observer.observe(this.pageRef.current);
    }
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
  }

  render() {
    return (
      <div className="skills-wrapper">

        {/* scroll cue lives outside skills-page so position:fixed works */}
        <div className="scroll-cue" aria-hidden="true">
          <span className="scroll-cue-text">SCROLL</span>
          <div className="scroll-cue-arrows">
            <div className="scroll-arrow" />
            <div className="scroll-arrow" />
          </div>
        </div>

        <div className="skills-page" ref={this.pageRef}>
          <div className="skills-header">
            <p className="skills-subtitle">what I bring to the table</p>
            <h1 className="skills-title">MY SKILLS</h1>
          </div>

          <div className="skills-content">
            {skillsData.map((section, sectionIndex) => (
              <div
                className="skills-section"
                key={section.category}
                style={{ animationDelay: `${sectionIndex * 0.15}s` }}
              >
                <h2 className="category-title">{section.category}</h2>
                <div className="bubbles-container">
                  {section.skills.map((skill, skillIndex) => (
                    <div
                      className="bubble"
                      key={skill}
                      style={{ animationDelay: `${sectionIndex * 0.15 + skillIndex * 0.07}s` }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }
}