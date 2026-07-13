/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Send, CheckCircle2, XCircle, Sparkles, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { stagger, fadeUp, fadeRight } from "./contactTypes";
import type { FormData, FormStatus } from "./contactTypes";

// ─── AI Assist Dropdown Component ─────────────────────────────────────────────

interface AIAssistProps {
  onSelectMode: (mode: 'Enhance' | 'Shorten' | 'Lengthen' | 'Casual' | 'Formal') => void;
  disabled?: boolean;
}

const AIAssist: React.FC<AIAssistProps> = ({ onSelectMode, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Enhance", "Shorten", "Lengthen", "Casual", "Formal"] as const;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 9px",
          borderRadius: 8,
          background: disabled 
            ? "rgba(255, 255, 255, 0.03)" 
            : "rgba(139, 92, 246, 0.12)",
          border: `1px solid ${disabled ? "rgba(255, 255, 255, 0.08)" : "rgba(139, 92, 246, 0.35)"}`,
          color: disabled ? "rgba(255, 255, 255, 0.3)" : "#c084fc",
          fontSize: 10.5,
          fontWeight: 500,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          fontFamily: "'Outfit', sans-serif",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.22)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.55)";
            e.currentTarget.style.boxShadow = "0 0 8px rgba(139, 92, 246, 0.25)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.12)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.35)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        <Sparkles size={11.5} className={disabled ? "" : "animate-pulse"} />
        <span>AI Assist</span>
        <ChevronDown 
          size={10.5} 
          style={{ 
            transform: isOpen ? "rotate(180deg)" : "none", 
            transition: "transform 0.2s ease" 
          }} 
        />
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              cursor: "default",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              zIndex: 1000,
              background: "rgba(10, 6, 22, 0.96)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              borderRadius: 10,
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(139, 92, 246, 0.1)",
              padding: "5px",
              minWidth: 120,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              transformOrigin: "top right",
              animation: "fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelectMode(option);
                  setIsOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "7px 12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 6,
                  color: "rgba(220, 220, 255, 0.85)",
                  fontSize: 11.5,
                  fontWeight: 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.18)";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.paddingLeft = "14px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(220, 220, 255, 0.85)";
                  e.currentTarget.style.paddingLeft = "12px";
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Field ────────────────────────────────────────────────────────────────────

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
  toolparamdescription?: string;
  extraAction?: React.ReactNode;
  isAiLoading?: boolean;
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
  rows = 4,
  toolparamdescription,
  extraAction,
  isAiLoading = false,
}) => {
  const [focused, setFocused] = useState(false);
  const isGlowing = focused || isAiLoading;
  
  const base: React.CSSProperties = {
    width: "100%",
    outline: "none",
    padding: "11px 14px",
    borderRadius: 11,
    fontSize: 13.5,
    fontWeight: 300,
    fontFamily: "'Outfit',sans-serif",
    color: "#fff",
    background: isGlowing ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${
      isAiLoading 
        ? "rgba(139,92,246,0.8)" 
        : focused 
        ? "rgba(139,92,246,0.5)" 
        : "rgba(255,255,255,0.08)"
    }`,
    boxShadow: isAiLoading
      ? "0 0 15px rgba(139,92,246,0.25)"
      : focused 
      ? "0 0 0 3px rgba(139,92,246,0.1)" 
      : "none",
    transition: "all 0.25s ease",
    backdropFilter: "blur(8px)",
    resize: "none" as const,
    animation: isAiLoading ? "pulseGlow 1.5s infinite ease-in-out" : "none",
  };
  return (
    <motion.div variants={fadeUp}>
      <label
        htmlFor={id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            letterSpacing: "0.4px",
            color: "rgba(200,200,240,0.55)",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#a78bfa", marginLeft: 3 }}>*</span>
          )}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {hint && (
            <span
              style={{
                fontSize: 9.5,
                color: "rgba(200,200,240,0.28)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {hint}
            </span>
          )}
          {extraAction}
        </div>
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
          style={{ ...base, display: "block" }}
          {...({ toolparamdescription } as any)}
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
          style={base}
          {...({ toolparamdescription } as any)}
        />
      )}
    </motion.div>
  );
};

// ─── Form Widget ──────────────────────────────────────────────────────────────

interface FormWidgetProps {
  isInView: boolean;
}

const FormWidget: React.FC<FormWidgetProps> = ({ isInView }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const loading = status === "loading";

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState("");

  const handleAiAssist = (mode: 'Enhance' | 'Shorten' | 'Lengthen' | 'Casual' | 'Formal') => {
    setIsAiLoading(true);
    setAiStatus("✨ AI is analyzing context...");

    setTimeout(() => {
      setAiStatus(`✨ Refactoring message to ${mode}...`);
      
      setTimeout(() => {
        setAiStatus("✨ Polishing style...");
        
        setTimeout(() => {
          setFormData(prev => {
            const currentMsg = prev.message.trim();
            let newMsg = "";
            
            if (!currentMsg) {
              if (mode === "Enhance") {
                newMsg = "Hi Shanjid,\n\nI was highly impressed by your portfolio and the caliber of projects you have delivered. I am reaching out to discuss a potential collaboration opportunity on an upcoming web development project. Let's schedule a time to talk.\n\nBest regards,";
              } else if (mode === "Shorten") {
                newMsg = "Hi Shanjid, let's collaborate on a web application project. Let me know when you're free to talk.";
              } else if (mode === "Lengthen") {
                newMsg = "Dear Shanjid,\n\nI hope this message finds you well. I recently explored your professional portfolio and was thoroughly impressed by your technical expertise, particularly in full-stack architecture and CLI systems. I am reaching out to inquire about your availability to collaborate on an exciting new software project. I believe your skills would align perfectly with our goals. Looking forward to discussing details soon.\n\nWarm regards,";
              } else if (mode === "Casual") {
                newMsg = "Hey Shanjid! Checked out your portfolio and loved your work. I have an interesting project idea and would love to team up. Let me know if you'd be down to chat sometime soon!";
              } else if (mode === "Formal") {
                newMsg = "Dear Shanjid Ahmad,\n\nI am writing to express interest in your technical services. Having reviewed your portfolio and modular Express architecture projects, I believe your expertise is well-suited for our business requirements. Please let know your availability for a brief consultation call.\n\nSincerely,";
              }
            } else {
              if (mode === "Enhance") {
                newMsg = `Hi Shanjid,\n\nRegarding: "${currentMsg}"\n\nI wanted to expand on this and reach out to collaborate. Your technical work is outstanding, and I believe combining our efforts would yield exceptional results. Let's discuss this project further at your earliest convenience.`;
              } else if (mode === "Shorten") {
                newMsg = `Hi Shanjid, regarding your work: ${currentMsg.slice(0, 60)}... Let's collaborate!`;
              } else if (mode === "Lengthen") {
                newMsg = `Dear Shanjid,\n\nI am contacting you regarding: "${currentMsg}". I hope we can collaborate. I have been seeking a developer with your exact skillset in modular development and modern styling. I would love to schedule a meeting to detail the architecture and timelines.`;
              } else if (mode === "Casual") {
                newMsg = `Hey Shanjid! Real quick about: "${currentMsg}". Super excited to collaborate on this. Let's connect soon and work out the details!`;
              } else if (mode === "Formal") {
                newMsg = `Dear Mr. Ahmad,\n\nI am writing in reference to: "${currentMsg}". I would like to formally request a consultation to explore options for collaboration on this project. Thank you.`;
              }
            }
            return { ...prev, message: newMsg };
          });
          setIsAiLoading(false);
          setAiStatus("");
        }, 850);
      }, 850);
    }, 850);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) =>
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  return (
    <motion.div
      variants={fadeRight}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(5,3,15,0.5)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { border-color: rgba(139,92,246,0.6); box-shadow: 0 0 8px rgba(139,92,246,0.15); }
          50% { border-color: rgba(139,92,246,1); box-shadow: 0 0 16px rgba(139,92,246,0.45); }
        }
      `}</style>

      {/* Radial highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% -20%,rgba(139,92,246,0.09),transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Browser chrome */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.025)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#ff5f57",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#ffbd2e",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#28c840",
            opacity: 0.7,
          }}
        />
        {/* URL bar */}
        <div
          style={{
            flex: 1,
            margin: "0 10px",
            height: 22,
            borderRadius: 6,
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            gap: 5,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#28c840",
              opacity: 0.7,
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            shanjidahmad.com/contact
          </span>
        </div>
        <Send size={12} color="rgba(255,255,255,0.2)" />
      </div>

      {/* Form body */}
      <div
        style={{ padding: "24px 24px 28px", position: "relative", zIndex: 1 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          variants={stagger}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
          {...({
            toolname: "send_contact_message",
            tooldescription: "Send a contact form message or project inquiry directly to Shanjid Ahmad."
          } as any)}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
            className="cc-name-email"
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
              toolparamdescription="Sender's full name"
            />
            <Field
              id="email"
              name="email"
              label="Email"
              required
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              toolparamdescription="Sender's email address for replies"
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
            toolparamdescription="The topic or subject line of the message"
          />
          <Field
            id="message"
            name="message"
            label="Message"
            required
            multiline
            rows={4}
            placeholder={isAiLoading ? "AI is rewriting your message..." : "Tell me about your project, or just say hello!"}
            value={isAiLoading ? aiStatus : formData.message}
            onChange={handleChange}
            disabled={loading || isAiLoading}
            isAiLoading={isAiLoading}
            extraAction={
              <AIAssist 
                disabled={loading || isAiLoading} 
                onSelectMode={handleAiAssist} 
              />
            }
            toolparamdescription="The full content of the message or message details"
          />

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "11px 14px",
                borderRadius: 10,
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.22)",
              }}
            >
              <CheckCircle2 size={15} color="#34d399" />
              <p
                style={{
                  fontSize: 12.5,
                  color: "#34d399",
                  margin: 0,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Sent! I'll reply within 24 hours.
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
                gap: 9,
                padding: "11px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.22)",
              }}
            >
              <XCircle size={15} color="#f87171" />
              <p
                style={{
                  fontSize: 12.5,
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

          <motion.div variants={fadeUp}>
            <button
              type="submit"
              disabled={loading || status === "success"}
              className="cc-submit"
            >
              <span className="sheen" aria-hidden="true" />
              {loading ? (
                <>
                  <span className="cc-spinner" aria-hidden="true" />
                  Sending…
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={16} />
                  Message Sent
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default FormWidget;
