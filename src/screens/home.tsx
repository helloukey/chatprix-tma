import Peep from "react-peeps";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn, countries } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Popover } from "@radix-ui/react-popover";
import { format, isAfter, isBefore, startOfDay, subYears } from "date-fns";
import {
  Bolt,
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Gem,
  LockOpen,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

export const SettingsDrawer = () => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { setTheme, theme } = useTheme();
  const { user } = useUserState((state) => state);

  const { toast } = useToast();
  const [calendarDate, setCalendarDate] = useState<Date>(
    subYears(new Date(), 18)
  );

  const today = startOfDay(new Date());
  const maxDate = subYears(today, 18);
  const minDate = subYears(today, 99);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 82 }, (_, i) => currentYear - 18 - i);
  }, []);

  const handleYearChange = useCallback(
    (selectedYear: string) => {
      const newYear = Number.parseInt(selectedYear, 10);
      const newDate = new Date(newYear, calendarDate.getMonth(), 1);
      setCalendarDate(newDate);
    },
    [calendarDate]
  );

  const isDateInRange = useCallback(
    (date: Date) => {
      return !isAfter(date, maxDate) && !isBefore(date, minDate);
    },
    [maxDate, minDate]
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate && isDateInRange(newDate)) {
      setDate(newDate);
      setCalendarDate(newDate);
    } else if (newDate) {
      toast({
        title: "Invalid date",
        description: "Please select a date between 18 and 99 years ago.",
        variant: "destructive",
      });
    } else {
      setDate(undefined);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Bolt />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="justify-end">
          <DialogTitle>
            <Select
              onValueChange={(value) => setTheme(value)}
              value={theme || "dark"}
            >
              <SelectTrigger className="w-fit">
                <span className="pr-2 text-xs opacity-50">Theme:</span>
                <SelectValue placeholder={theme ? theme : "dark"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </DialogTitle>
        </DrawerHeader>
        <div className="w-full flex flex-col justify-center gap-4 px-4">
          <div className="w-full flex items-center justify-center">
            <AvatarDialog>
              <Peep
                style={{
                  width: 64,
                  height: 64,
                  justifyContent: "center",
                  alignSelf: "center",
                }}
                accessory={user ? user.avatar.accessories : "GlassRoundThick"}
                body={user ? user.avatar.body : "Shirt"}
                face={user ? user.avatar.face : "Cute"}
                hair={user ? user.avatar.hair : "ShortVolumed"}
                facialHair={user ? user.avatar.facialHair : "Dali"}
                strokeColor="black"
                backgroundColor="white"
              />
            </AvatarDialog>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              placeholder="eg: johndoe"
              className="text-sm font-medium text-muted-foreground"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="gender">Gender</Label>
            <Select>
              <SelectTrigger className="w-full text-muted-foreground">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="dob">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Date of Birth</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex items-center justify-between p-2 border-b">
                  <Select
                    value={calendarDate.getFullYear().toString()}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  month={calendarDate}
                  onMonthChange={setCalendarDate}
                  disabled={(date) => !isDateInRange(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Country */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Country</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between text-muted-foreground"
                >
                  {value
                    ? countries.find((country) => country.value === value)
                        ?.label
                    : "Select country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={country.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === country.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {country.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DrawerFooter className="flex-row">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
          <Button className="w-full">Update Profile</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const AlertDialogWrapper = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          <Filter /> Preferences
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🔓 Unlock Filters & Chat Better!</AlertDialogTitle>
          <AlertDialogDescription>
            Want better chat filters? Watch an ad to unlock them temporarily or
            upgrade to PRO for unlimited access!
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Buttons Container */}
        <div className="w-full flex flex-col gap-2 my-8">
          <Button variant="secondary" className="w-full">
            <LockOpen />
            Unlock with Ad
          </Button>
          <Button className="w-full">
            <Gem /> Upgrade to PRO
          </Button>
        </div>
        <AlertDialogFooter className="flex-row justify-end">
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import heroImage from "@/assets/hero.svg";
import Image from "next/image";
import { Filter, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Particles } from "@/components/ui/particles";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { accessories, body, face, facialHair, hair } from "./avatar";
import { useUserState } from "@/zustand/useStore";

export const Hero = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4 my-8">
      <Image
        src={heroImage}
        alt="Hero"
        className="w-48 h-48"
        width={192}
        height={192}
      />
      <h1 className="text-3xl font-bold text-center">Welcome to Chatprix</h1>
      <p className="text-muted-foreground text-center">
        Start chatting with strangers from around the world.
      </p>
      <div className="w-full flex gap-2">
        <AlertDialogWrapper />
        <Link
          href="/search"
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
        >
          <Search /> Search
        </Link>
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center text-xs mt-8">
      <p className="text-muted-foreground text-center">Made with ❤️</p>
      <a
        href="
          https://t.me/chatprix"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground"
      >
        &copy; {new Date().getFullYear()} Chatprix
      </a>
    </div>
  );
};

export const ParticlesWrapper = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <div className="relative w-full h-full bg-background md:shadow-xl">
      <div className="w-full h-full z-10">{children}</div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
};

export const AvatarDialog = ({ children }: { children: ReactNode }) => {
  const [avatarBackground, setAvatarBackground] = useState("#FFFFFF");

  return (
    <Dialog>
      <DialogTrigger className="bg-white rounded-full">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Create your fun avatar</DialogDescription>
        </DialogHeader>
        {/* Avatar Generator */}
        <div
          className="w-fit mx-auto rounded-full my-2"
          style={{ backgroundColor: avatarBackground }}
        >
          <Peep
            style={{
              width: 64,
              height: 64,
              justifyContent: "center",
              alignSelf: "center",
            }}
            accessory="GlassRoundThick"
            body="Shirt"
            face="Cute"
            hair="ShortVolumed"
            facialHair="Dali"
            strokeColor="black"
            backgroundColor="white"
          />
        </div>
        {/* Container */}
        <div className="grid grid-cols-2 justify-center items-center gap-2">
          {/* Accessories  */}
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="accessories">Accessories</Label>
            <Select>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {accessories.map((accessory) => (
                  <SelectItem key={accessory} value={accessory}>
                    {accessory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Body */}
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="body">Body</Label>
            <Select>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {body.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Face */}
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="face">Face</Label>
            <Select>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {face.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Facial Hairs */}
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="facial-hair">Facial Hair</Label>
            <Select>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {facialHair.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Hairs */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="hair">Hair</Label>
            <Select>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {hair.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Background */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="background">Background</Label>
            <Input
              type="color"
              value={avatarBackground}
              onChange={(e) => setAvatarBackground(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center justify-end mt-4">
          <DialogClose asChild>
            <Button type="button" variant="default" className="w-fit">
              Set & Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
