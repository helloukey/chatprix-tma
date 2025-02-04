"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/firebase/config";
import { findMatchFromQueue } from "@/firebase/queue";
import { useToast } from "@/hooks/use-toast";
import { ParticlesWrapper } from "@/screens/home";
import { LottieSearch } from "@/screens/search";
import { useUserState } from "@/zustand/useStore";
import {
  collection,
  DocumentData,
  documentId,
  onSnapshot,
  or,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search() {
  const { userId, user, loading } = useUserState((state) => state);
  const { toast } = useToast();
  const router = useRouter();
  const [trigger, setTrigger] = useState(false);

  // Find match and create a active chat
  useEffect(() => {
    const findMatch = async (id: string, user: DocumentData) => {
      try {
        const result = await findMatchFromQueue(id, user);
        if (result) {
          toast({
            title: "Match Found!",
            description: "You have been matched with a partner",
          });
          router.push("/chat/" + result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (userId && user) {
      findMatch(userId, user);
    }
  }, [userId, user, router, toast, trigger]);

  // Check for changes in active chat is user is already in chat
  useEffect(() => {
    const activeRef = collection(db, "active");
    const q = query(
      activeRef,
      or(where("user1", "==", userId), where("user2", "==", userId))
    );
    const unsub = onSnapshot(q, (doc) => {
      if (doc.empty) {
        return;
      }
      const document = doc.docs[0];
      if (document.exists()) {
        toast({
          title: "Match Found!",
          description: "You have been matched with a partner",
        });
        router.push("/chat/" + document.id);
      }
    });

    return () => unsub();
  }, [router, toast, userId]);

  // Trigger when there is a change in queues collection
  useEffect(() => {
    const queuesRef = collection(db, "queues");
    const q = query(queuesRef, where(documentId(), "!=", userId));
    const unsub = onSnapshot(q, () => {
      setTrigger((prev) => !prev);
    });

    return () => unsub();
  }, [userId]);

  return (
    <ParticlesWrapper>
      <div className="w-full h-full flex flex-col justify-center items-center p-4">
        <LottieSearch />
        <p className="text-muted-foreground text-center mb-8">
          Searching for Partner...
        </p>
        <Button className="w-full" disabled={loading}>
          Cancel
        </Button>
      </div>
    </ParticlesWrapper>
  );
}
