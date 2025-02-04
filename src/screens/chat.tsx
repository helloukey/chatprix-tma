"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { useUserState } from "@/zustand/useStore";
import {
  arrayUnion,
  deleteDoc,
  doc,
  DocumentData,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { SendHorizonal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import Peep from "react-peeps";

type Props = {
  chatId: string | null;
  chat: DocumentData | null;
};

export const Header = ({ chatId, chat }: Props) => {
  const { userId } = useUserState((state) => state);
  const [matchedUser, setMatchedUser] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle End Chat
  const handleEndChat = async () => {
    if (!userId || !chatId || !matchedUser) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "active", chatId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update Matched User
  useEffect(() => {
    if (!chat || !userId) return;

    if (chat.user1 == userId) {
      setMatchedUser(chat.user2profile);
    } else {
      setMatchedUser(chat.user1profile);
    }
  }, [chat, userId]);

  return (
    <div className="w-full flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <div
          className="w-fit rounded-full"
          style={{
            backgroundColor: matchedUser
              ? matchedUser.avatar.background
              : "white",
          }}
        >
          <Peep
            style={{
              width: 48,
              height: 48,
              justifyContent: "center",
              alignSelf: "center",
            }}
            accessory={matchedUser ? matchedUser.avatar.accessories : ""}
            body={matchedUser ? matchedUser.avatar.body : ""}
            face={matchedUser ? matchedUser.avatar.face : ""}
            hair={matchedUser ? matchedUser.avatar.hair : ""}
            facialHair={matchedUser ? matchedUser.avatar.facialHair : ""}
            strokeColor="black"
            backgroundColor="white"
          />
        </div>
        <p className="text-sm">
          {matchedUser ? matchedUser.username : "Fetching..."}{" "}
          <span className="text-xs text-muted-foreground"></span>
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={loading || !matchedUser}
          >
            End
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will end the chat for both
              parties.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              disabled={loading || !matchedUser}
              onClick={handleEndChat}
            >
              End this chat
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface ChatBubbleProps {
  message: string;
  isCurrentUser: boolean;
}

export const ChatBubble: FC<ChatBubbleProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}
    >
      <Card
        className={cn(
          "max-w-[70%]",
          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <CardContent className="p-3">
          <p>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};

interface Message {
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  text: string;
  sender: string;
}

export const Messages = ({ messages }: { messages: Message[] }) => {
  const { userId } = useUserState((state) => state);

  return (
    <div className="w-full h-full max-h-[75%] space-y-4 my-4 px-4 text-sm overflow-y-auto">
      {messages.map((message) => (
        <ChatBubble
          key={message.timestamp.seconds}
          message={message.text}
          isCurrentUser={message.sender == userId}
        />
      ))}
    </div>
  );
};

export const Action = ({ chatId }: { chatId: string | null }) => {
  const { userId } = useUserState((state) => state);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Send Message
  const handleSendMessage = async () => {
    if (!chatId || !userId || !message) return;

    try {
      setLoading(true);
      // Send message to chat
      await updateDoc(doc(db, "active", chatId), {
        messages: arrayUnion({
          timestamp: Timestamp.now().toString(),
          text: message,
          sender: userId,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="w-full flex gap-2 items-center p-4">
      <Textarea
        placeholder="Type a message..."
        className="w-11/12 text-sm flex-grow resize-none overflow-hidden py-2 px-3"
        style={{
          height: "40px",
          minHeight: "40px", // Ensure minimum height is always 40px
          lineHeight: "24px", // Adjust line height for better text alignment
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        variant="outline"
        size="default"
        disabled={loading || !chatId || !userId}
        onClick={handleSendMessage}
      >
        <SendHorizonal />
      </Button>
    </div>
  );
};
