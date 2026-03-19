import { Github, Linkedin } from "lucide-react";
import type { ElementType } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FormStatus = "idle" | "loading" | "success" | "error";
export type PhoneScreen = "idle" | "dialing" | "calling" | "email" | "map";

export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SocialLink {
  readonly icon: ElementType;
  readonly label: string;
  readonly href: string;
  readonly accent: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const PHONE_NUMBER = "01626974685";
export const EMAIL_ADDRESS = "shanjidahmad502@gmail.com";

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/levi9111",
    accent: "#e2e8f0",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shanjid-ahmad-b77b5427b",
    accent: "#60a5fa",
  },
];

// ─── Framer variants ──────────────────────────────────────────────────────────

import type { Variants } from "framer-motion";

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const screenAnim: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.22 } },
};

// ─── Shared styles injected once ──────────────────────────────────────────────

export const CONTACT_GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes cDotPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
  @keyframes cRipple    { 0%{transform:translate(-50%,-50%) scale(0.6);opacity:0.8} 100%{transform:translate(-50%,-50%) scale(1.3);opacity:0} }
  @keyframes cBlink     { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes cHue       { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }
  @keyframes cSpin      { to{transform:rotate(360deg)} }

  #contact-section {
    font-family:'Outfit',sans-serif;
    position:relative; padding:120px 0 100px;
    background:transparent; overflow:visible;
  }
  #contact-section::before {
    content:''; position:absolute; top:0; left:8%; right:8%; height:1px;
    background:linear-gradient(90deg,transparent,rgba(139,92,246,0.25),transparent);
    pointer-events:none;
  }
  .cc-inner { position:relative;z-index:1;max-width:1160px;margin:0 auto;padding:0 32px; }

  /* Header */
  .cc-eyebrow {
    display:inline-flex;align-items:center;gap:10px;
    padding:7px 16px;border-radius:100px;
    border:1px solid rgba(139,92,246,0.2);
    background:rgba(5,3,15,0.5);backdrop-filter:blur(12px);
    font-size:10px;letter-spacing:4px;text-transform:uppercase;
    color:rgba(167,139,250,0.85);margin-bottom:20px;
  }
  .cc-eyebrow::before { content:'';display:block;width:20px;height:1px;background:rgba(139,92,246,0.5); }
  .cc-title {
    font-family:'Instrument Serif',serif;
    font-size:clamp(38px,6.5vw,72px);
    line-height:1.05;color:#fff;letter-spacing:-1.5px;
  }
  .cc-title-accent {
    font-style:italic;
    background:linear-gradient(135deg,#a78bfa 0%,#818cf8 45%,#38bdf8 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:cHue 8s ease-in-out infinite;
  }
  .cc-divider {
    width:64px;height:1px;margin:20px auto 0;
    background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),transparent);
    position:relative;
  }
  .cc-divider::after {
    content:'';position:absolute;top:-2px;left:50%;transform:translateX(-50%);
    width:4px;height:4px;border-radius:50%;background:#a78bfa;box-shadow:0 0 8px #a78bfa;
  }

  /* Body grid: phone-widget | form-widget */
  .cc-body {
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:28px;
    align-items:start;
  }

  /* Bottom strip: availability | social */
  .cc-bottom {
    display:grid;
    grid-template-columns:1fr auto;
    gap:20px;
    align-items:center;
    margin-top:20px;
  }

  /* Form inputs */
  #contact-section input::placeholder,
  #contact-section textarea::placeholder { color:rgba(200,200,240,0.25); }
  #contact-section input:disabled,
  #contact-section textarea:disabled { opacity:0.5;cursor:not-allowed; }

  /* Submit button */
  .cc-submit {
    width:100%;padding:13px 24px;border-radius:13px;
    border:1px solid rgba(139,92,246,0.4);
    background:rgba(139,92,246,0.15);
    color:rgba(200,180,255,0.95);
    font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;
    cursor:pointer;position:relative;overflow:hidden;
    display:flex;align-items:center;justify-content:center;gap:8px;
    transition:background .25s,border-color .25s,color .25s,transform .2s,box-shadow .25s;
    backdrop-filter:blur(12px);letter-spacing:0.3px;
  }
  .cc-submit:hover:not(:disabled){
    background:rgba(139,92,246,0.28);border-color:rgba(139,92,246,0.7);
    color:#d4bbff;transform:translateY(-2px);box-shadow:0 10px 36px rgba(139,92,246,0.25);
  }
  .cc-submit:disabled{opacity:0.6;cursor:not-allowed;}
  .cc-submit .sheen{
    position:absolute;inset:0;
    background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
    transform:translateX(-100%);transition:transform .65s ease;
  }
  .cc-submit:hover:not(:disabled) .sheen{transform:translateX(100%);}
  .cc-spinner{
    width:16px;height:16px;border-radius:50%;
    border:2px solid rgba(200,180,255,0.25);border-top-color:rgba(200,180,255,0.9);
    animation:cSpin .7s linear infinite;
  }

  /* Responsive */
  @media(max-width:1000px){ .cc-body{grid-template-columns:1fr;} }
  @media(max-width:680px){
    #contact-section{padding:72px 0 64px;}
    .cc-inner{padding:0 16px;}
    .cc-bottom{grid-template-columns:1fr;}
    .cc-phone-row{flex-direction:column!important;align-items:center!important;}
    .cc-triggers{width:100%!important;}
  }
  @media(max-width:480px){ .cc-name-email{grid-template-columns:1fr!important;} }
`;
