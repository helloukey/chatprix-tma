import type { NextApiRequest, NextApiResponse } from "next";
import { Bot } from "grammy";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      res
        .status(500)
        .json({ success: false, message: "Credentials not found." });
      return;
    }
    const title = "Chatprix PRO";
    const description = "Get Chatprix PRO for a month";
    const payload = "";
    const provider_token = "";
    const currency = "USD";
    const price = [
      {
        label: "Chatprix PRO",
        amount: 4.99,
      },
    ];

    const invoiceLink = await bot.api.createInvoiceLink(
      title,
      description,
      payload,
      provider_token, // Provider token must to be empty for Telegram stars
      currency,
      price
    );
    res.status(200).json({ success: true, invoiceLink });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
