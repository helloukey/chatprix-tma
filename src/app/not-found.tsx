import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-9xl font-bold tracking-tighter animate-pulse">
        4<span className="text-primary">0</span>4
      </h1>
      <p className="mt-4 text-xl font-medium">Oops! Page not found</p>
      <p className="mt-2 text-muted-foreground text-center max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <div className="mt-8 space-x-4">
        <Button variant="outline" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
