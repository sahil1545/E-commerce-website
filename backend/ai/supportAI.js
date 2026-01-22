import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Fallback replies (used when OpenAI is down)
function localAI(message) {
  const msg = message.toLowerCase();

  if (msg.includes("order"))
    return "📦 You can check your order status in the Orders section.";
  if (msg.includes("refund"))
    return "💰 Refunds are processed within 5–7 business days.";
  if (msg.includes("delivery"))
    return "🚚 Your delivery is on the way! You will get tracking updates.";
  if (msg.includes("cancel"))
    return "❌ You can cancel an order before it is shipped.";
  if (msg.includes("payment"))
    return "💳 We support Cash on Delivery and Card payments.";

  return "👩‍💼 Our support team is here to help. Please tell me your issue.";
}

export async function getAIReply(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional ecommerce customer support agent for ShopSphere. Be helpful and concise."
        },
        { role: "user", content: message }
      ]
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI failed → Using Local AI");

    // 🔥 Prevent crash
    return localAI(message);
  }
}
