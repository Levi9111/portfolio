/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Send, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { stagger, fadeUp, fadeRight } from "./contactTypes";
import type { FormData, FormStatus } from "./contactTypes";

// ─── EmailJS config ───────────────────────────────────────────────────────────

const SERVICE_ID = import.meta.env.VITE_EMAIL_JS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY;
const AUTO_REPLY_TEMPLATE = import.meta.env
  .VITE_EMAIL_JS_AUTO_REPLY_TEMPLATE_ID;

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
}) => {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: "100%",
    outline: "none",
    padding: "11px 14px",
    borderRadius: 11,
    fontSize: 13.5,
    fontWeight: 300,
    fontFamily: "'Outfit',sans-serif",
    color: "#fff",
    background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
    boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
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
            rows={4}
            placeholder="Tell me about your project, or just say hello!"
            value={formData.message}
            onChange={handleChange}
            disabled={loading}
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
