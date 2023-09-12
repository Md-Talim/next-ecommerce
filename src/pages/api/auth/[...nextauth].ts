import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Stripe from 'stripe';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2023-08-16',
      });

      // create a stripe customer
      const costomer = await stripe.customers.create({
        name: user.name || undefined,
        email: user.email || undefined,
      });

      // update the prisma user with the stripe customer id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: costomer.id },
      });
    },
  },
});
