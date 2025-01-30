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
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";

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
      <Button variant="outline" size="default" >
        <SendHorizonal />
      </Button>
    </div>
  );
};
