import api from "./api";

export const getTicket = () => api.post("/api/support/ticket");

export const sendMessage = (ticketId, message) =>
  api.post("/api/support/message", {
    ticket_id: ticketId,
    message,
  });
