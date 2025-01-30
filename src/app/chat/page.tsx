"use client";

import { Action, Header, Messages } from "@/screens/chat";

export default function Chat() {
  return (
    <div className="w-full h-full flex flex-col justify-between items-center">
      <Header />
      <Messages />
      <Action />
    </div>
  );
}
