import { NextResponse } from "next/server";
import { Bot } from "grammy";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

export async function POST() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { success: false, message: "Credentials not found." },
      { status: 500 }
    );
  }

  const title = "Chatprix PRO";
  const description = "Get Chatprix PRO for a month";
  const payload = "chatprix_pro_monthly";
  const provider_token = "";
  const currency = "XTR";
  const prices = [
    {
      label: "Chatprix PRO Monthly",
      amount: 249,
    },
  ];
  const subscription_period = 2592000;

  try {
    const invoiceLink = await bot.api.createInvoiceLink(
      title,
      description,
      payload,
      provider_token,
      currency,
      prices,
      { subscription_period }
    );

    return NextResponse.json({ success: true, invoiceLink }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create invoice", error },
      { status: 500 }
    );
  }
}
