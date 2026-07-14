import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { stagger, fadeUp, fadeRight } from "./contactTypes";
import type { FormData, FormStatus } from "./contactTypes";

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
  const [showModes, setShowModes] = useState(false);
  const [aiWarning, setAiWarning] = useState("");
  const [aiError, setAiError] = useState("");
  const [isGeneratingSubject, setIsGeneratingSubject] = useState(false);

  const handleModeClick = async (
    mode: "Enhance" | "Shorten" | "Lengthen" | "Casual" | "Formal",
  ) => {
    setShowModes(false);
    setAiWarning("");
    setAiError("");

    const currentMsg = formData.message.trim();

    // Validation: if the textarea is empty or has fewer than 5 characters, prevent AI call
    if (!currentMsg || currentMsg.length < 5) {
      setAiWarning(
        "Please write at least 5 characters first so the AI can assist you!",
      );
      return;
    }

    setIsAiLoading(true);
    setAiStatus("✨ AI is rewriting...");

    // Debounce / slight delay of 300ms to reduce unnecessary clicks
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const baseUrl =
        import.meta.env.VITE_API_URL ||
        "https://portfolio-server-xf38.onrender.com/api/v1";
      const response = await fetch(`${baseUrl}/ai-assist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: currentMsg,
          mode: mode.toLowerCase(),
        }),
      });

      if (response.status === 429) {
        const errData = await response.json().catch(() => ({}));
        setAiError(
          errData.error ||
            "You have used the AI assistant too quickly. Please wait a minute and try again.",
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Could not enhance message right now.");
      }

      const data = await response.json();
      if (data.success && data.improvedText) {
        setFormData((prev) => ({ ...prev, message: data.improvedText }));
      } else {
        throw new Error("Could not enhance message right now.");
      }
    } catch (error) {
      console.error("AI Assist error:", error);
      setAiError(
        "Could not enhance message right now. Please try again in a moment.",
      );
    } finally {
      setIsAiLoading(false);
      setAiStatus("");
    }
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

    const baseUrl =
      import.meta.env.VITE_API_URL ||
      "https://portfolio-server-xf38.onrender.com/api/v1";
    const finalFormData = { ...formData };

    try {
      // If subject is empty, generate it via AI first
      if (!formData.subject.trim()) {
        setIsGeneratingSubject(true);
        try {
          const aiResponse = await fetch(`${baseUrl}/ai-assist`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userMessage: formData.message,
              mode: "generate-subject",
            }),
          });

          if (aiResponse.status === 429) {
            const errData = await aiResponse.json().catch(() => ({}));
            setAiError(
              errData.error ||
                "You have used the AI assistant too quickly. Please wait a minute and try again.",
            );
            const fallbackSubject = "Portfolio Inquiry";
            setFormData((prev) => ({ ...prev, subject: fallbackSubject }));
            finalFormData.subject = fallbackSubject;
            await new Promise((resolve) => setTimeout(resolve, 800));
          } else if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            if (aiData.success && aiData.improvedText) {
              const generatedSubject = aiData.improvedText.trim();

              // 1. Update form data state so it appears in the text field for the user to see
              setFormData((prev) => ({ ...prev, subject: generatedSubject }));

              // 2. Set the subject in our local variable that will be sent
              finalFormData.subject = generatedSubject;

              // 3. Wait a moment (1200ms) so the user can visually see it
              await new Promise((resolve) => setTimeout(resolve, 1200));
            }
          }
        } catch (aiErr) {
          console.error("AI Subject generation failed:", aiErr);
          const fallbackSubject = "Portfolio Inquiry";
          setFormData((prev) => ({ ...prev, subject: fallbackSubject }));
          finalFormData.subject = fallbackSubject;
          await new Promise((resolve) => setTimeout(resolve, 800));
        } finally {
          setIsGeneratingSubject(false);
        }
      }

      const response = await fetch(`${baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
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
            tooldescription:
              "Send a contact form message or project inquiry directly to Shanjid Ahmad.",
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
            placeholder={
              isAiLoading
                ? "AI is rewriting your message..."
                : "Tell me about your project, or just say hello!"
            }
            value={isAiLoading ? aiStatus : formData.message}
            onChange={handleChange}
            disabled={loading || isAiLoading}
            isAiLoading={isAiLoading}
            toolparamdescription="The full content of the message or message details"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: -4,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  disabled={loading || isAiLoading}
                  onClick={() => setShowModes(!showModes)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background:
                      loading || isAiLoading
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(139, 92, 246, 0.12)",
                    border: `1px solid ${loading || isAiLoading ? "rgba(255, 255, 255, 0.08)" : "rgba(139, 92, 246, 0.35)"}`,
                    color:
                      loading || isAiLoading
                        ? "rgba(255, 255, 255, 0.3)"
                        : "#c084fc",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: loading || isAiLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    fontFamily: "'Outfit', sans-serif",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!(loading || isAiLoading)) {
                      e.currentTarget.style.background =
                        "rgba(139, 92, 246, 0.22)";
                      e.currentTarget.style.borderColor =
                        "rgba(139, 92, 246, 0.55)";
                      e.currentTarget.style.boxShadow =
                        "0 0 8px rgba(139, 92, 246, 0.25)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(loading || isAiLoading)) {
                      e.currentTarget.style.background =
                        "rgba(139, 92, 246, 0.12)";
                      e.currentTarget.style.borderColor =
                        "rgba(139, 92, 246, 0.35)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <Sparkles
                    size={13}
                    className={loading || isAiLoading ? "" : "animate-pulse"}
                  />
                  <span>AI Assist</span>
                  <ChevronDown
                    size={11}
                    style={{
                      transform: showModes ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {isAiLoading && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#a78bfa",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      className="cc-spinner"
                      style={{ width: 12, height: 12, borderWidth: 1.5 }}
                    />
                    <span>AI is rewriting...</span>
                  </span>
                )}
              </div>

              {/* Character count */}
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {formData.message.length} characters
              </span>

              {/* Popup menu */}
              {showModes && (
                <>
                  <div
                    onClick={() => setShowModes(false)}
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
                      bottom: "calc(100% + 8px)",
                      left: 0,
                      zIndex: 1000,
                      background: "rgba(10, 6, 22, 0.96)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                      borderRadius: 10,
                      boxShadow:
                        "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(139, 92, 246, 0.1)",
                      padding: "5px",
                      minWidth: 120,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      transformOrigin: "bottom left",
                      animation: "fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {(
                      [
                        "Enhance",
                        "Shorten",
                        "Lengthen",
                        "Casual",
                        "Formal",
                      ] as const
                    ).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleModeClick(option)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "7px 12px",
                          background: "transparent",
                          border: "none",
                          borderRadius: 6,
                          color: "rgba(220, 220, 255, 0.85)",
                          fontSize: 12,
                          fontWeight: 400,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          fontFamily: "'Outfit', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(139, 92, 246, 0.18)";
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.paddingLeft = "14px";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color =
                            "rgba(220, 220, 255, 0.85)";
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

            {/* Warnings & Errors */}
            {aiWarning && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: 11,
                  color: "#fbbf24",
                  fontFamily: "'Outfit', sans-serif",
                  marginTop: 4,
                }}
              >
                ⚠️ {aiWarning}
              </motion.span>
            )}
            {aiError && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: 11,
                  color: "#f87171",
                  fontFamily: "'Outfit', sans-serif",
                  marginTop: 4,
                }}
              >
                ❌ {aiError}
              </motion.span>
            )}
          </div>

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
                  {isGeneratingSubject ? "Generating Subject…" : "Sending…"}
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
