import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

// fauna

import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  // signingKey: process.env.SIGNING_KEY,
  callbacks: {
    async session({ session, token, user }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );

        return { ...session, activeSubscription: userActiveSubscription };
      } catch (err) {
        console.log("erro ao adicionar à session a activeSubscription", err);
        return { ...session, activeSubscription: null };
      }
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),
            q.Create(q.Collection("users"), { data: { email: user.email } }),

            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
          )
        );
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
  secret: "test",
});
