import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export default stripe;
