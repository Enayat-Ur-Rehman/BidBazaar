import Stripe from "stripe";

let stripe = null;

// Initialize Stripe only when needed
const initializeStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("✅ Stripe initialized");
  }
  return stripe;
};

export const createCheckoutSession = async (paymentData) => {
  try {
    const stripeInstance = initializeStripe();

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Auction Payment - ${paymentData.auctionTitle}`,
              description: `20% deposit for winning bid`,
            },
            unit_amount: Math.round(paymentData.amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: paymentData,
    });
    console.log("Stripe session created:", session.id);
    return session;
  } catch (error) {
    console.error("Stripe error:", error.message);
    throw error;
  }
};

export const verifyPaymentSession = async (sessionId) => {
  try {
    const stripeInstance = initializeStripe();
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    return {
      isPaid: session.payment_status === "paid",
      session,
    };
  } catch (error) {
    console.error("Verification error:", error.message);
    throw error;
  }
};

