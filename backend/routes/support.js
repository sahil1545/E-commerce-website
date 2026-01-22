import express from "express";
import supabase from "../config/supabase.js";
import fetchUser from "../middleware/fetchUser.js";
import { getAIReply } from "../ai/supportAI.js";

const router = express.Router();

// Create or get ticket
router.post("/ticket", fetchUser, async (req, res) => {
  const { data } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", req.user.id)
    .eq("status", "OPEN")
    .single();

  if (data) return res.json(data);

  const { data: ticket } = await supabase
    .from("support_tickets")
    .insert({ user_id: req.user.id })
    .select()
    .single();

  res.json(ticket);
});

// Send message
router.post("/message", fetchUser, async (req, res) => {
  const { ticket_id, message } = req.body;

  const { data: userMsg } = await supabase
    .from("support_messages")
    .insert({
      ticket_id,
      sender: "USER",
      message,
    })
    .select()
    .single();

  const aiReply = await getAIReply(message);

  await supabase.from("support_messages").insert({
    ticket_id,
    sender: "ADMIN",
    message: aiReply,
  });

  res.json(userMsg);
});

// 🔥 GET messages
router.get("/:ticketId", fetchUser, async (req, res) => {
  const { data, error } = await supabase
    .from("support_messages")
    .select("*")
    .eq("ticket_id", req.params.ticketId)
    .order("created_at");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

router.get("/messages/:ticketId", fetchUser, async (req, res) => {
  const { data } = await supabase
    .from("support_messages")
    .select("*")
    .eq("ticket_id", req.params.ticketId)
    .order("created_at");

  res.json(data);
});


export default router;
