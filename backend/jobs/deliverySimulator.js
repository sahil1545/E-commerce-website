import supabase from "../config/supabase.js";

const statusFlow = [
  "PLACED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const startDeliverySimulator = () => {
  setInterval(async () => {
    const { data: orders } = await supabase
      .from("orders")
      .select("id, delivery_status")
      .neq("delivery_status", "DELIVERED");

    for (const order of orders || []) {
      const index = statusFlow.indexOf(order.delivery_status);
      if (index < statusFlow.length - 1) {
        await supabase
          .from("orders")
          .update({
            delivery_status: statusFlow[index + 1],
          })
          .eq("id", order.id);
      }
    }
  }, 15000); // every 15 seconds
};
