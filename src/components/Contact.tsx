import React, { useState, useRef } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import emailjs from "@emailjs/browser";

// ─── EmailJS config ───────────────────────────────────────────────────────────

const SERVICE_ID = import.meta.env.VITE_EMAIL_JS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY;
const AUTO_REPLY_TEMPLATE = import.meta.env
  .VITE_EMAIL_JS_AUTO_REPLY_TEMPLATE_ID;

// ─── Types ────────────────────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactItem {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly accent: string;
  readonly glow: string;
}

interface SocialLink {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly href: string;
  readonly accent: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACT_ITEMS: readonly ContactItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: "shanjidahmad502@gmail.com",
    href: "mailto:shanjidahmad502@gmail.com",
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.12)",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+880 1626 974685",
    href: "https://wa.me/8801626974685",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.12)",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Chattogram, Bangladesh",
    href: "https://maps.google.com/?q=Chattogram,Bangladesh",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.12)",
  },
] as const;

const SOCIAL_LINKS: readonly SocialLink[] = [
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
] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Contact Info Card ────────────────────────────────────────────────────────

interface ContactCardProps {
  item: ContactItem;
}

const ContactCard: React.FC<ContactCardProps> = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.a
      variants={fadeLeft}
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 4, scale: 1.01 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        borderRadius: 14,
        textDecoration: "none",
        border: `1px solid ${hovered ? item.accent + "44" : "rgba(255,255,255,0.07)"}`,
        background: hovered ? `rgba(5,3,15,0.7)` : "rgba(5,3,15,0.45)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        transition: "border-color 0.25s, background 0.25s",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: 2,
          borderRadius: 1,
          background: item.accent,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
          boxShadow: `0 0 8px ${item.accent}`,
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          flexShrink: 0,
          background: `${item.accent}14`,
          border: `1px solid ${item.accent}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s",
          transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1)",
        }}
      >
        <Icon size={18} color={item.accent} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(200,200,240,0.38)",
            fontFamily: "'DM Sans', sans-serif",
            margin: "0 0 3px",
          }}
        >
          {item.label}
        </p>
        <p
          style={{
            fontSize: 13.5,
            fontWeight: 400,
            color: hovered ? "#fff" : "rgba(220,220,245,0.75)",
            fontFamily: "'Outfit', sans-serif",
            transition: "color 0.25s",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.value}
        </p>
      </div>

      <ArrowUpRight
        size={14}
        color={item.accent}
        style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
          flexShrink: 0,
        }}
      />
    </motion.a>
  );
};

// ─── Availability Widget ──────────────────────────────────────────────────────
// Small inline card showing current status + avg response time

const AvailabilityWidget: React.FC = () => (
  <motion.div
    variants={fadeUp}
    style={{
      padding: "16px 18px",
      borderRadius: 14,
      border: "1px solid rgba(52,211,153,0.2)",
      background: "rgba(52,211,153,0.05)",
      backdropFilter: "blur(12px)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Pulsing green dot */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#34d399",
            boxShadow: "0 0 8px rgba(52,211,153,0.7)",
            display: "block",
            animation: "contactDotPulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#34d399",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Available for work
        </span>
      </div>
      <Zap size={14} color="#34d399" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {(
        [
          {
            icon: Clock,
            label: "Response time",
            value: "< 24h",
            accent: "#a78bfa",
          },
          {
            icon: CheckCircle2,
            label: "Status",
            value: "Open",
            accent: "#34d399",
          },
        ] as const
      ).map(({ icon: Icon, label, value, accent }) => (
        <div
          key={label}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 5,
            }}
          >
            <Icon size={11} color={accent} />
            <span
              style={{
                fontSize: 9,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "rgba(200,200,240,0.35)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {label}
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  </motion.div>
);

// ─── Input / Textarea ─────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  name: string;
  label: string;
  hint?: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  disabled: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const Field: React.FC<FieldProps> = ({
  id,
  name,
  label,
  hint,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
  required,
  multiline,
  rows = 5,
}) => {
  const [focused, setFocused] = useState(false);

  const baseStyle: React.CSSProperties = {
    width: "100%",
    outline: "none",
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 300,
    fontFamily: "'Outfit', sans-serif",
    color: "#fff",
    background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
    boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.12)" : "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    backdropFilter: "blur(8px)",
    resize: "none" as const,
  };

  return (
    <motion.div variants={fadeUp}>
      <label
        htmlFor={id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 7,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.5px",
            color: "rgba(200,200,240,0.6)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#a78bfa", marginLeft: 3 }}>*</span>
          )}
        </span>
        {hint && (
          <span
            style={{
              fontSize: 10,
              color: "rgba(200,200,240,0.3)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {hint}
          </span>
        )}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...baseStyle, display: "block" }}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      )}
    </motion.div>
  );
};

// ─── Contact ──────────────────────────────────────────────────────────────────

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        PUBLIC_KEY,
      );

      await emailjs.send(
        SERVICE_ID,
        AUTO_REPLY_TEMPLATE,
        {
          name: formData.name,
          title: formData.subject,
          to_email: formData.email,
        },
        PUBLIC_KEY,
      );

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const loading = status === "loading";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #contact-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 140px 0 120px;
          background: transparent;
          overflow: visible;
        }

        #contact-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }

        /* eyebrow */
        .contact-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(5,3,15,0.5);
          backdrop-filter: blur(12px);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 20px;
        }
        .contact-eyebrow::before {
          content: ''; display: block; width: 20px; height: 1px;
          background: rgba(139,92,246,0.5);
        }

        /* title */
        .contact-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(44px, 6.5vw, 76px);
          line-height: 1.05; color: #fff; letter-spacing: -1.5px;
        }
        .contact-title-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: contactHue 8s ease-in-out infinite;
        }
        @keyframes contactHue { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }

        /* divider */
        .contact-divider {
          width: 64px; height: 1px; margin: 24px auto 0;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
          position: relative;
        }
        .contact-divider::after {
          content: ''; position: absolute; top: -2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
        }

        /* availability dot pulse */
        @keyframes contactDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }

        /* dark input placeholder */
        #contact-section input::placeholder,
        #contact-section textarea::placeholder {
          color: rgba(200,200,240,0.25);
        }
        #contact-section input:disabled,
        #contact-section textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* submit button */
        .contact-submit {
          width: 100%; padding: 14px 24px; border-radius: 13px;
          border: 1px solid rgba(139,92,246,0.4);
          background: rgba(139,92,246,0.15);
          color: rgba(200,180,255,0.95);
          font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 500;
          cursor: pointer; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: background 0.25s, border-color 0.25s, color 0.25s,
                      transform 0.2s, box-shadow 0.25s;
          backdrop-filter: blur(12px);
          letter-spacing: 0.3px;
        }
        .contact-submit:hover:not(:disabled) {
          background: rgba(139,92,246,0.28);
          border-color: rgba(139,92,246,0.7);
          color: #d4bbff;
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(139,92,246,0.25);
        }
        .contact-submit:disabled {
          opacity: 0.6; cursor: not-allowed;
        }
        .contact-submit .sheen {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.65s ease;
        }
        .contact-submit:hover:not(:disabled) .sheen { transform: translateX(100%); }

        /* spin */
        @keyframes spin { to { transform: rotate(360deg); } }
        .contact-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(200,180,255,0.25);
          border-top-color: rgba(200,180,255,0.9);
          animation: spin 0.7s linear infinite;
        }

        @media (max-width: 768px) {
          #contact-section { padding: 100px 0 80px; }
        }
      `}</style>

      <section id="contact-section" ref={sectionRef}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* ── Header ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginBottom: 72 }}
          >
            <motion.div variants={fadeUp}>
              <div className="contact-eyebrow">Let's collaborate</div>
            </motion.div>
            <motion.h2 className="contact-title" variants={fadeUp}>
              Let's <span className="contact-title-accent">Connect</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <div className="contact-divider" />
            </motion.div>
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 15,
                fontWeight: 300,
                color: "rgba(190,190,220,0.5)",
                maxWidth: 500,
                margin: "20px auto 0",
                lineHeight: 1.8,
              }}
            >
              Have a project in mind or just want to say hello? I read every
              message and reply within 24 hours.
            </motion.p>
          </motion.div>

          {/* ── Two-column body ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.35fr",
              gap: 48,
              alignItems: "start",
            }}
            className="contact-grid"
          >
            {/* ── Left: info + availability ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(22px, 3vw, 30px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  marginBottom: 6,
                }}
              >
                Get in{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  touch
                </span>
              </motion.h3>

              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: 13.5,
                  fontWeight: 300,
                  color: "rgba(190,190,220,0.45)",
                  lineHeight: 1.8,
                  marginBottom: 8,
                }}
              >
                Open to freelance projects, full-time roles, and technical
                consulting. Based in Chattogram — working globally.
              </motion.p>

              {/* Contact cards */}
              {CONTACT_ITEMS.map((item) => (
                <ContactCard key={item.label} item={item} />
              ))}

              {/* Availability widget */}
              <AvailabilityWidget />

              {/* Social links */}
              <motion.div
                variants={fadeUp}
                style={{ display: "flex", gap: 10, marginTop: 4 }}
              >
                {SOCIAL_LINKS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        border: `1px solid rgba(255,255,255,0.08)`,
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(200,200,240,0.55)",
                        textDecoration: "none",
                        transition:
                          "border-color 0.25s, color 0.25s, background 0.25s",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = `${s.accent}55`;
                        el.style.color = s.accent;
                        el.style.background = `${s.accent}10`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "rgba(255,255,255,0.08)";
                        el.style.color = "rgba(200,200,240,0.55)";
                        el.style.background = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* ── Right: contact form ── */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              {/* Glass form card */}
              <div
                style={{
                  padding: "36px 32px",
                  borderRadius: 22,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(5,3,15,0.5)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top radial highlight */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                      "radial-gradient(ellipse at 50% -20%, rgba(139,92,246,0.1), transparent 65%)",
                  }}
                  aria-hidden="true"
                />

                <motion.form
                  onSubmit={handleSubmit}
                  noValidate
                  variants={stagger}
                  initial="hidden"
                  animate={isInView ? "show" : "hidden"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* Row: name + email */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                    className="contact-name-email-row"
                  >
                    <Field
                      id="name"
                      name="name"
                      label="Name"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <Field
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <Field
                    id="subject"
                    name="subject"
                    label="Subject"
                    hint="optional"
                    placeholder="Project idea / inquiry topic"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <Field
                    id="message"
                    name="message"
                    label="Message"
                    required
                    multiline
                    rows={5}
                    placeholder="Tell me about your project, or just say hello!"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  {/* Status messages */}
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        borderRadius: 11,
                        background: "rgba(52,211,153,0.1)",
                        border: "1px solid rgba(52,211,153,0.25)",
                      }}
                    >
                      <CheckCircle2 size={16} color="#34d399" />
                      <p
                        style={{
                          fontSize: 13,
                          color: "#34d399",
                          margin: 0,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Message sent! I'll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        borderRadius: 11,
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                      }}
                    >
                      <XCircle size={16} color="#f87171" />
                      <p
                        style={{
                          fontSize: 13,
                          color: "#f87171",
                          margin: 0,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {!formData.name || !formData.email || !formData.message
                          ? "Please fill in all required fields."
                          : "Something went wrong. Please try again."}
                      </p>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.div variants={fadeUp}>
                    <button
                      type="submit"
                      disabled={loading || status === "success"}
                      className="contact-submit"
                    >
                      <span className="sheen" aria-hidden="true" />
                      {loading ? (
                        <>
                          <span
                            className="contact-spinner"
                            aria-hidden="true"
                          />
                          Sending…
                        </>
                      ) : status === "success" ? (
                        <>
                          <CheckCircle2 size={17} />
                          Message Sent
                        </>
                      ) : (
                        <>
                          <Send size={17} />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              </div>
            </motion.div>
          </div>

          {/* Responsive stacking */}
          <style>{`
            .contact-grid {
              grid-template-columns: 1fr 1.35fr;
            }
            @media (max-width: 860px) {
              .contact-grid {
                grid-template-columns: 1fr;
              }
            }
            @media (max-width: 520px) {
              .contact-name-email-row {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </section>
    </>
  );
};

export default Contact;
