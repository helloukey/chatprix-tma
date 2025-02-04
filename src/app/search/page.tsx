"use client";

import { Button } from "@/components/ui/button";
import { findMatchFromQueue } from "@/firebase/queue";
import { useToast } from "@/hooks/use-toast";
import { ParticlesWrapper } from "@/screens/home";
import { LottieSearch } from "@/screens/search";
import { useUserState } from "@/zustand/useStore";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Search() {
  const { userId, user, loading } = useUserState((state) => state);
  const { toast } = useToast();
  const router = useRouter();

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
  }, [userId, user, router, toast]);

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
