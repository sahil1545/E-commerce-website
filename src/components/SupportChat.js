import { useEffect, useRef, useState } from "react";
import { getTicket, sendMessage } from "../services/supportApi";
import api from "../services/api";

export default function SupportChat() {
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    if (open) {
      getTicket().then((res) => {
        setTicket(res.data);
        loadMessages(res.data.id);
      });
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async (ticketId) => {
    const res = await api.get(`/api/support/messages/${ticketId}`);
    setMessages(res.data);
  };

  const handleSend = async () => {
    if (!text.trim() || !ticket) return;

    const userMsg = { sender: "USER", message: text };
    setMessages((prev) => [...prev, userMsg]);
    setText("");

    await sendMessage(ticket.id, text);
    loadMessages(ticket.id);
  };

  if (!open)
    return (
      <div style={styles.fab} onClick={() => setOpen(true)}>
        💬
      </div>
    );

  return (
    <div style={styles.chatBox}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.avatar}>🤖</div>
          <div>
            <strong>ShopSphere Support</strong>
            <div style={{ fontSize: 12, color: "#dcfce7" }}>Online</div>
          </div>
        </div>
        <button style={styles.close} onClick={() => setOpen(false)}>
          ❌
        </button>
      </div>

      {/* MESSAGES */}
      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={
              m.sender === "USER"
                ? styles.userBubble
                : styles.botBubble
            }
          >
            {m.message}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button onClick={handleSend} style={styles.send}>
          ➤
        </button>
      </div>
    </div>
  );
}

/* STYLES */

const styles = {
  fab: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#25D366",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 28,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    zIndex: 9999,
  },
  chatBox: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 350,
    height: 480,
    background: "#ece5dd",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    zIndex: 9999,
  },
  header: {
    background: "#075e54",
    color: "white",
    padding: "10px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#25D366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  close: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "#dcf8c6",
    padding: "8px 12px",
    borderRadius: "10px 10px 0 10px",
    maxWidth: "75%",
    fontSize: 14,
  },
  botBubble: {
    alignSelf: "flex-start",
    background: "white",
    padding: "8px 12px",
    borderRadius: "10px 10px 10px 0",
    maxWidth: "75%",
    fontSize: 14,
  },
  inputBox: {
    display: "flex",
    padding: 10,
    background: "#f0f0f0",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "none",
    outline: "none",
  },
  send: {
    marginLeft: 8,
    background: "#25D366",
    border: "none",
    color: "white",
    borderRadius: "50%",
    width: 40,
    height: 40,
    cursor: "pointer",
    fontSize: 18,
  },
};
