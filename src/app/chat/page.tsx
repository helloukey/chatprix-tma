"use client";

import { Action, Header } from "@/screens/chat";

export default function Chat() {
  return (
    <div className="w-full h-screen flex flex-col justify-between items-center">
      <Header />
      <Action />
    </div>
  );
}
