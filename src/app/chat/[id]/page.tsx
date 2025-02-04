"use client";

import { db } from "@/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { Action, Header, Messages } from "@/screens/chat";
import { useUserState } from "@/zustand/useStore";
import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Chat({ params }: { params: { id: string } }) {
  const { userId } = useUserState((state) => state);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chat, setChat] = useState<DocumentData | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Get active chat data
  useEffect(() => {
    if (!userId) return;

    const activeRef = doc(db, "active", params.id);
    const unsubscribe = onSnapshot(activeRef, (snapshot) => {
      if (snapshot.exists()) {
        setChatId(snapshot.id);
        setChat(snapshot.data());
      } else {
        toast({
          title: "Chat Ended",
          description: "This chat has ended",
        });
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [params.id, userId, router, toast]);

  return (
    <div className="w-full h-full flex flex-col justify-between items-center">
      <Header chatId={chatId} chat={chat} />
      <Messages messages={chat ? chat.messages : []} />
      <Action />
    </div>
  );
}
