// ============================================================
//  ContactMenu.js — v1
//  Sections:
//    • Hero header — "LET'S TALK" + location badge
//    • Tagline strip — confident one-liner
//    • Platform cards — Email, Instagram, LinkedIn (SVG icons)
//    • Availability strip — open to opportunities
//    • Footer note
// ============================================================

import React, { Component } from "react";
import {
  PROFILE_EMAIL_MAILTO,
  PROFILE_LINKEDIN_URL,
} from "../constants/socialLinks";
import "../styles/contactMenu.css";

// ── inline SVG icons (black pictograms) ─────────────────────
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="platform-icon">
    <rect x="2" y="4" width="20" height="16" rx="3" fill="currentColor" opacity="0.08"/>
    <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="platform-icon">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="platform-icon">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="loc-icon">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15"/>
    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="arrow-icon">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── contact platform data ────────────────────────────────────
const platforms = [
  {
    id: "email",
    label: "Email",
    handle: "a54gandh@uwaterloo.ca",
    href: PROFILE_EMAIL_MAILTO,
    Icon: EmailIcon,
    cta: "Send a message",
    note: "Usually responds within 24 hrs",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@imayushgandhi",
    href: "https://instagram.com/imayushgandhi",
    Icon: InstagramIcon,
    cta: "Follow along",
    note: "Behind-the-scenes & builds",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "Ayush Gandhi",
    href: PROFILE_LINKEDIN_URL,
    Icon: LinkedInIcon,
    cta: "Connect professionally",
    note: "Open to opportunities",
  },
];

// ── marquee words ────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars -- used when marquee JSX is uncommented
const marqueeWords = [
  "COLLABORATE",
  "·",
  "BUILD",
  "·",
  "INNOVATE",
  "·",
  "CREATE",
  "·",
  "ENGINEER",
  "·",
  "DESIGN",
  "·",
];

export default class ContactMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { hoveredCard: null };
  }

  render() {
    const { hoveredCard } = this.state;

    return (
      <div className="contact-section">

        {/* ── marquee ticker (top) ──
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span key={i} className="marquee-word">{w}</span>
            ))}
          </div>
        </div> */}

        {/* ── hero ── */}
        <header className="contact-hero">
          <div className="hero-left">
            <h1 className="hero-heading">
              <span className="hero-thin">LET'S</span>
              <span className="hero-bold">TALK</span>
            </h1>

            <p className="hero-sub">
              Whether it's a project, an opportunity,
              <br />or just a good conversation, I'm totally open to it!
            </p>
          </div>

          {/* location badge sits above the gyroscope */}
          <div className="hero-right">
            <div className="location-badge">
              <LocationIcon />
              <span>Waterloo, ON — Canada</span>
            </div>

            {/* gyroscope — 3 rings on 3 axes */}
            <div className="gyroscope" aria-hidden="true">
              <div className="gyro-ring gyro-ring-1" />
              <div className="gyro-ring gyro-ring-2" />
              <div className="gyro-ring gyro-ring-3" />
              <span className="hero-deco-text">REACH OUT</span>
            </div>
          </div>
        </header>

        {/* ── divider ── */}
        <div className="section-divider">
          <div className="divider-line" />
          <span className="divider-label">CONTACT CHANNELS</span>
          <div className="divider-line" />
        </div>

        {/* ── platform cards ── */}
        <div className="platforms-grid">
          {platforms.map((p, i) => (
            <a
              key={p.id}
              href={p.href}
              target={p.id !== "email" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`platform-card platform-card--${p.id} ${hoveredCard === p.id ? "hovered" : ""}`}
              style={{ animationDelay: `${0.1 + i * 0.15}s` }}
              onMouseEnter={() => this.setState({ hoveredCard: p.id })}
              onMouseLeave={() => this.setState({ hoveredCard: null })}
              aria-label={`Contact via ${p.label}`}
            >
              {/* card number */}
              <span className="card-num">0{i + 1}</span>

              {/* icon */}
              <div className="card-icon-wrap">
                <p.Icon />
              </div>

              {/* info */}
              <div className="card-info">
                <span className="card-label">{p.label}</span>
                <span className="card-handle">{p.handle}</span>
                <span className="card-note">{p.note}</span>
              </div>

              {/* cta */}
              <div className="card-cta">
                <span>{p.cta}</span>
                <ArrowIcon />
              </div>

              {/* hover fill bar */}
              <div className="card-fill-bar" aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* ── info strip ── */}
        <div className="info-strip">
          <div className="info-block">
            <span className="info-label">BASED IN</span>
            <span className="info-value">Montréal, QC</span>
          </div>
          <div className="info-divider" />
          <div className="info-block">
            <span className="info-label">STUDYING AT</span>
            <span className="info-value">University of Waterloo</span>
          </div>
          <div className="info-divider" />
          <div className="info-block">
            <span className="info-label">AVAILABILITY</span>
            <span className="info-value info-value--open">● Open to Opportunities</span>
          </div>
          <div className="info-divider" />
          <div className="info-block">
            <span className="info-label">RESPONSE TIME</span>
            <span className="info-value">&lt; 24 Hours</span>
          </div>
        </div>

        {/* ── tagline ──
        <div className="tagline-section">
          <p className="tagline-eyebrow">PHILOSOPHY</p>
          <blockquote className="tagline">
            "I build things that matter — from robotics to simulations,
            <br className="tagline-br"/>
            the goal is always the same: make it real, make it work, make it count."
          </blockquote>
          <span className="tagline-sig">— Ayush Gandhi</span>
        </div> */}

        {/* ── bottom marquee ──
        <div className="marquee-strip marquee-strip--reverse" aria-hidden="true">
          <div className="marquee-track marquee-track--reverse">
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span key={i} className="marquee-word">{w}</span>
            ))}
          </div>
        </div> */}

      </div>
    );
  }
}
