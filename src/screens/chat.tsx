import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
      <Button variant="destructive" size="sm">End</Button>
    </div>
  );
};
