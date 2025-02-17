"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/firebase/config";
import {
  findMatchFromQueue,
  findMatchFromQueueNoFilter,
  removeFromQueue,
} from "@/firebase/queue";
import { resetFilter } from "@/firebase/user";
import { useToast } from "@/hooks/use-toast";
import { useUpdateLastSeen } from "@/hooks/use-update-last-seen";
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
  const { userId, user, loading, isPro } = useUserState((state) => state);
  const { toast } = useToast();
  const router = useRouter();
  const [trigger, setTrigger] = useState(false);
  useUpdateLastSeen();

  // Handle cancel search
  const handleCancel = async () => {
    if (userId) {
      try {
        await removeFromQueue(userId);
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    } else {
      router.push("/");
    }
  };

  // Find match and create a active chat
  useEffect(() => {
    const findMatch = async (id: string, user: DocumentData) => {
      try {
        const result = user.filters
          ? await findMatchFromQueue(id, user)
          : await findMatchFromQueueNoFilter(id, user);
        if (result) {
          await removeFromQueue(id);
          await resetFilter(isPro, id);
          toast({
            title: "Match Found!",
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
  }, [userId, user, router, toast, trigger, isPro]);

  // Check for changes in active chat is user is already in chat
  useEffect(() => {
    if (!userId) return;

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
        removeFromQueue(document.data().user1);
        removeFromQueue(document.data().user2);
        resetFilter(isPro, userId);
        toast({
          title: "Match Found!",
        });
        router.push("/chat/" + document.id);
      }
    });

    return () => unsub();
  }, [isPro, router, toast, userId]);

  // Trigger when there is a change in queues collection
  useEffect(() => {
    if (!userId) return;

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
        <Button className="w-full" disabled={loading} onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </ParticlesWrapper>
  );
}
