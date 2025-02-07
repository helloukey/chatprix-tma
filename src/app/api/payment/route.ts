export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import { Bot, webhookCallback } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

const bot = new Bot(token);
bot.on(":successful_payment", async (ctx) => {
  await ctx.reply("Thank you for subscribing to Chatprix PRO! 🎉" + ctx);
});

export const POST = webhookCallback(bot, "std/http");
