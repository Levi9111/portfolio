import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  CONTACT_GLOBAL_CSS,
  fadeUp,
  PhoneScreen,
  stagger,
} from "./shared/ContactComponent/contactTypes";
import PhoneWidget, { useDialer } from "./shared/ContactComponent/PhoneWidget";
import FormWidget from "./shared/ContactComponent/FormWidghet";
import BottomStrip from "./shared/ContactComponent/BottomStrip";

// ─── Contact ──────────────────────────────────────────────────────────────────

const Contact: React.FC = () => {
  // ── All hooks unconditionally at the very top ──
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const [screen, setScreen] = useState<PhoneScreen>("idle");

  const dialerActive = screen === "dialing" || screen === "calling";
  const { digits, calling } = useDialer(dialerActive);

  // Advance dialing → calling once hook fires
  useEffect(() => {
    if (calling && screen === "dialing") setScreen("calling");
  }, [calling, screen]);

  const handleTrigger = (next: PhoneScreen) =>
    setScreen((prev) => (prev === next ? "idle" : next));

  return (
    <>
      <style>{CONTACT_GLOBAL_CSS}</style>

      <section id="contact-section" ref={sectionRef}>
        <div className="cc-inner">
          {/* ── 1. Header ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <motion.div variants={fadeUp}>
              <div className="cc-eyebrow">Let's collaborate</div>
            </motion.div>
            <motion.h2 className="cc-title" variants={fadeUp}>
              Let's <span className="cc-title-accent">Connect</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <div className="cc-divider" />
            </motion.div>
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 14.5,
                fontWeight: 300,
                color: "rgba(190,190,220,0.48)",
                maxWidth: 480,
                margin: "18px auto 0",
                lineHeight: 1.8,
              }}
            >
              Have a project in mind or just want to say hello? I read every
              message and reply within 24 hours.
            </motion.p>
          </motion.div>

          {/* ── 2. Body: Phone Widget | Form Widget ── */}
          <motion.div
            className="cc-body"
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            {/* Left column: phone mockup + trigger buttons */}
            <PhoneWidget
              screen={screen}
              digits={digits}
              calling={calling}
              onTrigger={handleTrigger}
            />

            {/* Right column: contact form in browser-chrome widget */}
            <FormWidget isInView={isInView} />
          </motion.div>

          {/* ── 3. Bottom strip: availability + social ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <BottomStrip />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
