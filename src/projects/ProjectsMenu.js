// ============================================================
//  ProjectsMenu.js — v2
//
//  Desktop (>1100px):
//    • Vertical scroll, one full-section per project
//    • Apple-style IntersectionObserver scroll animations
//    • Card info ALWAYS visible (no hover-to-reveal)
//    • Image flip cards on hover (caption on back)
//    • Image carousel with prev/next + dots
//    • Scroll progress bar + panel nav dots (bottom center)
//
//  Mobile (≤1100px):
//    • Vertical accordion list, tap to open/close
//    • Horizontal swipe image slider inside each accordion
// ============================================================

import React, { Component, createRef, useCallback, useLayoutEffect, useRef, useState } from "react";
import projects from "./projectsData";
import "../styles/projectsMenu.css";

/**
 * Hard cap on carousel / mobile gallery slides (single source of truth).
 * 12 keeps the UI usable (dots, swipe length) without huge payloads.
 */
const MAX_PROJECT_IMAGES = 12;

/** First `MAX_PROJECT_IMAGES` entries only; per-slide portrait/landscape from intrinsic size. */
function getProjectCarouselImages(project) {
  const list = project?.images;
  if (!Array.isArray(list)) return [];
  return list.slice(0, MAX_PROJECT_IMAGES);
}

/** Rich copy for flip-card reverse + mobile; prefers `image.insight` from data. */
function getFlipBackContent(image, projectTitle) {
  const title = projectTitle || "Project";
  if (image?.insight?.headline && image?.insight?.body) {
    return {
      eyebrow: image.insight.eyebrow || "Insight",
      headline: image.insight.headline,
      body: image.insight.body,
    };
  }
  const c = (image?.caption || "").trim();
  if (!c) {
    return {
      eyebrow: "Update",
      headline: "Documentation pending",
      body: `Narrative for this ${title} milestone will be added soon.`,
    };
  }
  return {
    eyebrow: "Snapshot",
    headline: title,
    body: c,
  };
}

function orientationFromImage(img) {
  if (!img?.naturalWidth || !img?.naturalHeight) return null;
  return img.naturalHeight > img.naturalWidth ? "portrait" : "landscape";
}

/** Desktop carousel slide: flip card + img; `carousel-slide--orient-*` from natural dimensions. */
function DesktopCarouselSlide({ image, isActive, projectTitle }) {
  const [orient, setOrient] = useState("pending");
  const imgRef = useRef(null);
  const flip = getFlipBackContent(image, projectTitle);

  const apply = useCallback((img) => {
    const o = orientationFromImage(img);
    if (o) setOrient(o);
  }, []);

  useLayoutEffect(() => {
    setOrient("pending");
    const img = imgRef.current;
    if (img?.complete) apply(img);
  }, [image.src, apply]);

  return (
    <div
      className={`carousel-slide carousel-slide--orient-${orient} ${isActive ? "active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img
              ref={imgRef}
              className={`project-img project-img--orient-${orient}`}
              src={image.src}
              alt={image.caption || flip.headline}
              onLoad={(e) => apply(e.currentTarget)}
              loading="lazy"
            />
            <span className="flip-hint">view detail</span>
          </div>
          <div className="flip-card-back">
            <div className="flip-card-back__noise" aria-hidden />
            <div className="flip-card-back__glow" aria-hidden />
            <div className="flip-card-back__accent" aria-hidden />
            <div className="flip-card-back__content">
              <span className="flip-card-back__eyebrow">{flip.eyebrow}</span>
              <h3 className="flip-card-back__title">{flip.headline}</h3>
              <p className="flip-card-back__body">{flip.body}</p>
              <span className="flip-card-back__project">{projectTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile accordion strip: one image + rich caption; same orientation classes as desktop. */
function MobileProjectImage({ img, projectTitle }) {
  const [orient, setOrient] = useState("pending");
  const imgRef = useRef(null);
  const flip = getFlipBackContent(img, projectTitle);

  const apply = useCallback((el) => {
    const o = orientationFromImage(el);
    if (o) setOrient(o);
  }, []);

  useLayoutEffect(() => {
    setOrient("pending");
    const el = imgRef.current;
    if (el?.complete) apply(el);
  }, [img.src, apply]);

  return (
    <div className="mobile-slide">
      <img
        ref={imgRef}
        className={`project-img project-img--orient-${orient}`}
        src={img.src}
        alt={img.caption || flip.headline}
        onLoad={(e) => apply(e.currentTarget)}
        loading="lazy"
      />
      <div className="mobile-caption-wrap">
        <span className="mobile-caption-eyebrow">{flip.eyebrow}</span>
        <p className="mobile-caption-title">{flip.headline}</p>
        <p className="mobile-caption-body">{flip.body}</p>
      </div>
    </div>
  );
}

// ── tiny inline SVG icons ─────────────────────────────────────
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    viewBox="0 0 24 24" width="18" height="18" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.35s ease" }}
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const padIndex = (i) => String(i + 1).padStart(2, "0");

/** Non-empty trimmed string — used for optional project links. */
function hasLinkText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function projectHasGithub(project) {
  return hasLinkText(project?.github);
}

function projectHasDemo(project) {
  return hasLinkText(project?.demo?.url);
}

function projectHasAnyLink(project) {
  return projectHasGithub(project) || projectHasDemo(project);
}

// ── Per-panel scroll-animate wrapper ─────────────────────────
class AnimatedPanel extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.state = { visible: false };
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.setState({ visible: true });
          this.observer.disconnect(); // fire once, like Apple
        }
      },
      { threshold: 0.12 }
    );
    if (this.ref.current) this.observer.observe(this.ref.current);
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
  }

  render() {
    const { children, delay = 0 } = this.props;
    const { visible } = this.state;
    return (
      <div
        ref={this.ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(60px)",
          transition: `opacity 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms,
                       transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
          willChange: "opacity, transform",
          width: "100%",
        }}
      >
        {children}
      </div>
    );
  }
}

// ── Main component ────────────────────────────────────────────
export default class ProjectsMenu extends Component {
  constructor(props) {
    super(props);
    this.mql = window.matchMedia("(max-width: 1100px)");
    this.panelRefs = projects.map(() => createRef());
    this.desktopScrollRef = createRef();
    this._scrollTarget = null;

    this.state = {
      activeImageIndices: Object.fromEntries(projects.map((_, i) => [i, 0])),
      openAccordion: null,
      isMobile: this.mql.matches,
      activePanelIndex: null,
      scrollProgress: 0,
    };
  }

  componentDidMount() {
    this.mql.addEventListener("change", this.handleMediaChange);
    this.attachScrollListener();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isMobile !== this.state.isMobile) {
      this.attachScrollListener();
    }
  }

  componentWillUnmount() {
    this.mql.removeEventListener("change", this.handleMediaChange);
    this.detachScrollListener();
  }

  handleMediaChange = (e) => this.setState({ isMobile: e.matches });

  detachScrollListener = () => {
    if (this._scrollTarget === window) {
      window.removeEventListener("scroll", this.handleScroll);
    } else if (this._scrollTarget) {
      this._scrollTarget.removeEventListener("scroll", this.handleScroll);
    }
    this._scrollTarget = null;
  };

  attachScrollListener = () => {
    this.detachScrollListener();
    this._scrollTarget = window;
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();
  };

  getDesktopSections() {
    const c = this.desktopScrollRef.current;
    if (!c) return [];
    return [...c.querySelectorAll(":scope > .intro-panel, :scope > .project-panel")];
  }

  getClosestSectionIndex() {
    const sections = this.getDesktopSections();
    if (sections.length === 0) return 0;
    const centerY = window.innerHeight / 2;
    let best = 0;
    let bestDist = Infinity;
    sections.forEach((sec, i) => {
      const r = sec.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const d = Math.abs(c - centerY);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  scrollToSectionIndex(sections, index, behavior) {
    const section = sections[index];
    if (!section) return;
    const r = section.getBoundingClientRect();
    const targetTop = window.scrollY + r.top - window.innerHeight / 2 + section.offsetHeight / 2;
    window.scrollTo({ top: targetTop, behavior });
  }

  handleScroll = () => {
    const { isMobile, activePanelIndex: currentActive } = this.state;
    const scrollTop = window.scrollY;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

    if (isMobile) {
      // Only update progress occasionally or if needed, but mobile doesn't even show the progress bar.
      if (Math.abs(this.state.scrollProgress - progress) > 0.05) {
        this.setState({ scrollProgress: progress });
      }
      return;
    }

    const sectionIdx = this.getClosestSectionIndex();
    const activePanelIndex = sectionIdx <= 0 ? null : sectionIdx - 1;
    
    // Throttle progress updates to ~1% increments to avoid excessive renders, and only update active index if changed.
    if (activePanelIndex !== currentActive || Math.abs(this.state.scrollProgress - progress) > 0.01) {
      this.setState({ scrollProgress: progress, activePanelIndex });
    }
  };

  scrollToPanel = (index) => {
    if (this.state.isMobile) return;
    const sections = this.getDesktopSections();
    const targetIndex = index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.scrollToSectionIndex(sections, targetIndex, reduced ? "auto" : "smooth");
  };

  handleImageNav = (projectIndex, direction, e) => {
    e.stopPropagation();
    const { activeImageIndices } = this.state;
    const total = getProjectCarouselImages(projects[projectIndex]).length;
    if (total <= 0) return;
    const current = activeImageIndices[projectIndex] || 0;
    this.setState({
      activeImageIndices: {
        ...activeImageIndices,
        [projectIndex]: (current + direction + total) % total,
      },
    });
  };

  setImageIndex = (projectIndex, imageIndex, e) => {
    if (e) e.stopPropagation();
    this.setState((prev) => ({
      activeImageIndices: { ...prev.activeImageIndices, [projectIndex]: imageIndex },
    }));
  };

  toggleAccordion = (index) => {
    this.setState((prev) => ({
      openAccordion: prev.openAccordion === index ? null : index,
    }));
  };

  renderDemoLink(demo, className = "btn-demo") {
    if (!demo || !hasLinkText(demo.url)) return null;
    const href = demo.url.trim();
    const label = demo.type === "youtube" ? "WATCH ON YOUTUBE" : "WATCH DEMO";
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <PlayIcon />
        {label}
      </a>
    );
  }

  renderCarousel(project, projectIndex) {
    const { activeImageIndices } = this.state;
    const images = getProjectCarouselImages(project);
    const total = images.length;
    const rawIdx = activeImageIndices[projectIndex] ?? 0;
    const currentIdx = total > 0 ? ((rawIdx % total) + total) % total : 0;
    const hasMany = total > 1;

    return (
      <div className="image-carousel">
        <div className="carousel-track">
          {images.map((image, i) => (
            <DesktopCarouselSlide key={i} image={image} isActive={i === currentIdx} projectTitle={project.title} />
          ))}
        </div>

        {hasMany && (
          <>
            <button className="carousel-btn carousel-prev" onClick={(e) => this.handleImageNav(projectIndex, -1, e)} aria-label="Previous image">‹</button>
            <button className="carousel-btn carousel-next" onClick={(e) => this.handleImageNav(projectIndex, 1, e)} aria-label="Next image">›</button>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <button key={i} className={`dot ${i === currentIdx ? "active" : ""}`} onClick={(e) => this.setImageIndex(projectIndex, i, e)} aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  renderDesktopPanel(project, index) {
    const isEven = index % 2 === 0;

    return (
      <AnimatedPanel key={project.id} delay={0}>
        <section
          className="project-panel"
          ref={this.panelRefs[index]}
          data-index={index}
        >
          <span className="panel-bg-number" aria-hidden="true">{padIndex(index)}</span>

          <div className={`project-card project-card--open ${isEven ? "card--left" : "card--right"}`}>

            <div className="card-info">
              <span className={`status-badge status-${project.status}`}>
                {project.status === "active" ? "● IN PROGRESS" : "✓ COMPLETED"}
              </span>
              <h2 className="card-title">{project.title}</h2>
              <p className="card-description">{project.description}</p>
              {projectHasAnyLink(project) && (
                <div className="card-links">
                  {projectHasGithub(project) && (
                    <a
                      href={project.github.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-github"
                    >
                      <GitHubIcon /> GITHUB
                    </a>
                  )}
                  {this.renderDemoLink(project.demo)}
                </div>
              )}
            </div>

            <div className="card-visuals">
              {this.renderCarousel(project, index)}
            </div>

          </div>
        </section>
      </AnimatedPanel>
    );
  }

  renderMobileAccordion() {
    const { openAccordion } = this.state;
    return (
      <div className="mobile-accordion">
        {projects.map((project, index) => {
          const isOpen = openAccordion === index;
          return (
            <div key={project.id} className={`accordion-item ${isOpen ? "open" : ""}`}>
              <button className="accordion-header" onClick={() => this.toggleAccordion(index)} aria-expanded={isOpen}>
                <span className="accordion-num">{padIndex(index)}</span>
                <span className="accordion-title">{project.title}</span>
                <span className={`status-badge status-${project.status}`}>
                  {project.status === "active" ? "IN PROGRESS" : "DONE"}
                </span>
                <ChevronIcon open={isOpen} />
              </button>
              <div className="accordion-body" aria-hidden={!isOpen}>
                <p className="accordion-description">{project.description}</p>
                <div className="mobile-slider">
                  {getProjectCarouselImages(project).map((img, i) => (
                    <MobileProjectImage key={i} img={img} projectTitle={project.title} />
                  ))}
                </div>
                {projectHasAnyLink(project) && (
                  <div className="accordion-links">
                    {projectHasGithub(project) && (
                      <a
                        href={project.github.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-github"
                      >
                        <GitHubIcon /> GITHUB
                      </a>
                    )}
                    {this.renderDemoLink(project.demo)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { isMobile, activePanelIndex, scrollProgress } = this.state;

    return (
      <div className="projects-section">
        {isMobile ? (
          <div className="projects-mobile">
            <header className="mobile-header">
              <p className="mobile-header-label">PORTFOLIO</p>
              <h1 className="mobile-heading">Projects</h1>
            </header>
            {this.renderMobileAccordion()}
          </div>
        ) : (
          <>
            {/* scroll progress bar */}
            <div
              className="scroll-progress-bar"
              style={{ width: `${scrollProgress * 100}%` }}
              aria-hidden="true"
            />

            {/* panel nav dots — bottom center */}
            <nav className="panel-nav" aria-label="Project navigation">
              {projects.map((_, i) => (
                <button
                  key={i}
                  className={`panel-nav-dot ${activePanelIndex === i ? "active" : ""}`}
                  onClick={() => this.scrollToPanel(i)}
                  aria-label={`Project ${i + 1}`}
                />
              ))}
            </nav>

            <div className="projects-desktop-scroll" ref={this.desktopScrollRef}>
              {/* ── vertical intro ── */}
              <section className="intro-panel">
                <div className="intro-content">
                  <AnimatedPanel delay={0}>
                    <p className="intro-label">SELECTED WORK</p>
                  </AnimatedPanel>
                  <AnimatedPanel delay={100}>
                    <h1 className="intro-heading">
                      <span className="intro-heading-thin">MY</span>
                      <span className="intro-heading-bold">PROJECTS</span>
                    </h1>
                  </AnimatedPanel>
                  <AnimatedPanel delay={220}>
                    <p className="intro-sub">{projects.length} projects · scroll to explore</p>
                  </AnimatedPanel>
                </div>
                <div className="scroll-cue" aria-hidden="true">
                  <span className="scroll-cue-text">SCROLL</span>
                  <div className="scroll-cue-arrows">
                    <div className="scroll-arrow" />
                    <div className="scroll-arrow" />
                  </div>
                </div>
              </section>

              {/* ── project panels ── */}
              {projects.map((project, index) => this.renderDesktopPanel(project, index))}
            </div>
          </>
        )}
      </div>
    );
  }
}