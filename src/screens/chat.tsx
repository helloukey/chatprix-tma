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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { FC, useState } from "react";

export const Header = () => {
  return (
    <div className="w-full flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CP</AvatarFallback>
        </Avatar>
        <p className="text-sm">
          JohnDoe{" "}
          <span className="text-xs text-muted-foreground">typing...</span>
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
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
  id: number;
  text: string;
  isCurrentUser: boolean;
}

export const Messages = () => {
  const [messages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", isCurrentUser: false },
    {
      id: 2,
      text: "Hi! I have a question about my order.",
      isCurrentUser: true,
    },
    {
      id: 3,
      text: "Sure, I'd be happy to help. What's your order number?",
      isCurrentUser: false,
    },
    {
      id: 4,
      text: "Sure, I'd be happy to help. What's your order number?",
      isCurrentUser: false,
    },
    {
      id: 5,
      text: "Sure, I'd be happy to help. What's your order number?",
      isCurrentUser: false,
    },
    {
      id: 6,
      text: "Sure, I'd be happy to help. What's your order number?",
      isCurrentUser: false,
    },
    {
      id: 7,
      text: "Sure, I'd be happy to help. What's your order number?",
      isCurrentUser: false,
    },
    {
      id: 8,
      text: "Sure, I'd be happy to help. What's your order number?",
      isCurrentUser: false,
    },
  ]);
  return (
    <div className="w-full h-full max-h-[75%] space-y-4 my-4 px-4 text-sm overflow-y-auto">
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message.text}
          isCurrentUser={message.isCurrentUser}
        />
      ))}
    </div>
  );
};

export const Action = () => {
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
      />
      <Button variant="outline" size="default">
        <SendHorizonal />
      </Button>
    </div>
  );
};
