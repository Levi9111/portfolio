// src/components/shared/Projects/InstallSnippet.tsx
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

const InstallSnippet: React.FC<{ packageName: string; accent: string }> = ({
  packageName,
  accent,
}) => {
  const [copied, setCopied] = useState(false);
  const command = `npm i -g ${packageName}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — fail silently, button just won't confirm
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.98 }}
      aria-label="Copy install command"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: `1px solid ${accent}35`,
        background: "rgba(0,0,0,0.35)",
        cursor: "pointer",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 12.5,
      }}
    >
      <span style={{ color: "rgba(200,200,240,0.8)" }}>
        <span style={{ color: accent }}>$</span> {command}
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          color: copied ? "#34d399" : accent,
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </span>
    </motion.button>
  );
};

export default InstallSnippet;
