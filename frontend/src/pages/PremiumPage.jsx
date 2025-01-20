import React, { useState } from "react";
import axios from "axios";

const PremiumPage = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/payment/create-payment-intent",
        { amount: 10 }, // Amount in dollars
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const clientSecret = response.data.clientSecret;

      // Redirect to Stripe Checkout
      const stripe = window.Stripe("your_stripe_public_key"); // Use your Stripe public key here
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Premium Access</h2>
        <p className="mb-4">
          To start audio/video calls, please make a payment of $10.
        </p>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay $10"}
        </button>
        <button onClick={onClose} className="mt-2 text-gray-500 underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PremiumPage;
