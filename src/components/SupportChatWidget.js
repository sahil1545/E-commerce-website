import { useState } from "react";
import SupportChat from "./SupportChat";

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#2563eb",
          color: "white",
          fontSize: 24,
          border: "none",
          cursor: "pointer",
          zIndex: 999,
        }}
      >
        💬
      </button>

      {open && <SupportChat onClose={() => setOpen(false)} />}
    </>
  );
}
