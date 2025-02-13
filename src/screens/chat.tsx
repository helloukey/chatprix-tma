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
import { useChatScroll } from "@/hooks/use-chat-scroll";
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
import { FC, useEffect, useRef, useState } from "react";
import Peep from "react-peeps";

type Props = {
  chatId: string | null;
  chat: DocumentData | null;
};

export const Header = ({ chatId, chat }: Props) => {
  const { userId } = useUserState((state) => state);
  const [matchedUser, setMatchedUser] = useState<DocumentData | null>(null);
  const [matchedUserTyping, setMatchedUserTyping] = useState(false);
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

    // Set matched user based on chat data
    if (chat.user1 == userId) {
      setMatchedUser(chat.user2profile);
    } else {
      setMatchedUser(chat.user1profile);
    }

    // Listen for typing status
    if (chat.user1 == userId) {
      setMatchedUserTyping(chat.user2typing);
    } else {
      setMatchedUserTyping(chat.user1typing);
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
          <span className="text-xs text-muted-foreground">
            {matchedUserTyping ? "typing..." : ""}
          </span>
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
  const ref = useChatScroll({ messages });

  return (
    <div
      className="w-full h-full max-h-[75%] space-y-4 my-4 px-4 text-sm overflow-y-auto"
      ref={ref}
    >
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

export const Action = ({
  chatId,
  chat,
}: {
  chatId: string | null;
  chat: DocumentData | null;
}) => {
  const { userId } = useUserState((state) => state);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Typing Status Update
  const updateTypingStatus = async (status: boolean) => {
    if (!chatId || !userId || !chat) return;
    if (userId == chat.user1) {
      await updateDoc(doc(db, "active", chatId), {
        user1typing: status,
      });
    } else {
      await updateDoc(doc(db, "active", chatId), {
        user2typing: status,
      });
    }
  };

  // Handle Message Change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 1500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Handle Send Message
  const handleSendMessage = async () => {
    if (!chatId || !userId || !message) return;
    try {
      setLoading(true);
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
      updateTypingStatus(false); // Ensure typing status resets after sending message
    }
  };

  return (
    <div className="w-full flex gap-2 items-center p-4">
      <Textarea
        placeholder="Type a message..."
        className="w-11/12 text-sm flex-grow resize-none overflow-hidden py-2 px-3"
        style={{ height: "40px", minHeight: "40px", lineHeight: "24px" }}
        value={message}
        onChange={handleMessageChange}
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
