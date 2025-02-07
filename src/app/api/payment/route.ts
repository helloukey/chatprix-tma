export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import { db } from "@/firebase/config";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { Bot, webhookCallback } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

const bot = new Bot(token);
bot.on("pre_checkout_query", async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

bot.on("message:successful_payment", async (ctx) => {
  const details = {
    user: ctx.from.id.toString(),
    currency: ctx.message.successful_payment.currency,
    invoice_payload: ctx.message.successful_payment.invoice_payload,
    is_first_recurring: ctx.message.successful_payment.is_first_recurring,
    is_recurring: ctx.message.successful_payment.is_recurring,
    provider_payment_charge_id:
      ctx.message.successful_payment.provider_payment_charge_id,
    telegram_payment_charge_id:
      ctx.message.successful_payment.telegram_payment_charge_id,
    total_amount: ctx.message.successful_payment.total_amount,
    subscription_expiration_date:
      ctx.message.successful_payment.subscription_expiration_date,
  };
  await addDoc(collection(db, "payments"), details);
  await updateDoc(doc(db, "users", ctx.from.id.toString()), {
    pro: details,
  });
  await ctx.reply("Thank you for subscribing to Chatprix PRO! 🎉");
});

export const POST = webhookCallback(bot, "std/http");
