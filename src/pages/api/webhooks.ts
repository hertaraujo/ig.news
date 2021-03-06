import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let raw;
  if (req.method === "POST") {
    try {
      const secret = req.headers["stripe-signature"];
      const buf = await buffer(req);
      // const body: string = buf.toString("utf8").replace(/\n/g, "");

      console.log(buf);

      raw = buf;

      let event: Stripe.Event;

      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      const { type } = event;

      console.log(event, type);

      if (relevantEvents.has(type)) {
        try {
          switch (type) {
            case "customer.subscription.updated":
            case "customer.subscription.deleted":
              const subscription = event.data.object as Stripe.Subscription;

              await saveSubscription(
                subscription.id,
                subscription.customer.toString(),
                false
              );

              break;
            case "checkout.session.completed":
              const checkoutSession = event.data
                .object as Stripe.Checkout.Session;

              await saveSubscription(
                checkoutSession.subscription.toString(),
                checkoutSession.customer.toString(),
                true
              );

              break;
            default:
              throw new Error("Unhandled event");
          }
        } catch (err) {
          return res.json({ error: `Webhook handler failed` });
        }
      }
    } catch (err) {
      return res.status(400).send(JSON.stringify({ raw, err }, null, 2));
    }
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
