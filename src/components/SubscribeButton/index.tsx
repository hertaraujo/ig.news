import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

export function SubscribeButton() {
  const session = useSession();
  const router = useRouter();

  const subscribeHandler = async () => {
    if (session.status !== "authenticated") {
      signIn("github");
      return;
    }

    if (session?.data?.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      router.push("/500");
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={subscribeHandler}
    >
      Subscribe Now
    </button>
  );
}
