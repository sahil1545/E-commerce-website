import { useState, useEffect } from "react";

function PaymentModal({ open, onClose, onSuccess, total }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [processing, setProcessing] = useState(false);

  // 🔁 Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setPaymentMethod("");
      setCardDetails({
        number: "",
        expiry: "",
        cvv: "",
        name: "",
      });
      setProcessing(false);
    }
  }, [open]);

  if (!open) return null;

  const handlePayment = () => {
    if (processing) return;

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // 💳 CARD PAYMENT
    if (paymentMethod === "CARD") {
      const { number, expiry, cvv, name } = cardDetails;

      if (!number || !expiry || !cvv || !name) {
        alert("Please fill all card details");
        return;
      }

      setProcessing(true);

      // ⏳ Simulate gateway delay
      setTimeout(() => {
        setProcessing(false);
        onSuccess("CARD"); // ✅ ONLY SUCCESS CALLBACK
      }, 2000);
    }

    // 🚚 CASH ON DELIVERY
    if (paymentMethod === "COD") {
      setProcessing(true);

      setTimeout(() => {
        setProcessing(false);
        onSuccess("COD"); // ✅ SAME FLOW AS CARD
      }, 800);
    }
  };

  const handleInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Payment Portal</h3>
        <p>Total: ₹{total}</p>

        {/* Payment Method */}
        <div style={{ marginBottom: 20 }}>
          <label>
            <input
              type="radio"
              value="CARD"
              checked={paymentMethod === "CARD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Pay with Card
          </label>

          <label style={{ marginLeft: 20 }}>
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        </div>

        {/* Card Fields */}
        {paymentMethod === "CARD" && (
          <div style={{ marginBottom: 20 }}>
            <input
              name="name"
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <input
              name="number"
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <input
                name="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleInputChange}
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                name="cvv"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          style={{ ...btn, opacity: processing ? 0.6 : 1 }}
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>

        <button style={close} onClick={onClose} disabled={processing}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* STYLES */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  padding: 25,
  borderRadius: 10,
  width: 320,
};

const btn = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  border: "none",
  borderRadius: 6,
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: 16,
};

const close = {
  marginTop: 10,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
};

export default PaymentModal;
