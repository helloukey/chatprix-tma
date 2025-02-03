import Peep from "react-peeps";
import { Button } from "@/components/ui/button";
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
import {
  Bolt,
  Check,
  ChevronsUpDown,
  Gem,
  Loader2,
  LockOpen,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { useUserState } from "@/zustand/useStore";

export const SettingsDrawer = () => {
  const { user, setUser, userId } = useUserState((state) => state);
  const [date, setDate] = useState<Date | undefined>(
    user && user?.dob ? user.dob : undefined
  );
  const [firestoreTimestamp, setFirestoreTimestamp] =
    useState<Timestamp | null>(null);
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle Date select
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);

    // Convert to Firebase Timestamp when a date is selected
    if (newDate) {
      const timestamp = Timestamp.fromDate(newDate);
      setFirestoreTimestamp(timestamp);
    } else {
      setFirestoreTimestamp(null);
    }
  };

  // Handle Profile Update
  const handleProfileUpdate = async () => {
    if (!username || !gender || !firestoreTimestamp || !country) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all the fields.",
        variant: "destructive",
      });
      return;
    }

    const pattern = /^[a-z][a-z0-9]{2,7}$/gm;

    // Username must start with an alphabet, be 3-8 characters long, and contain only alphabets and numbers
    if (!pattern.test(username)) {
      toast({
        title: "Invalid Username",
        description:
          "Username must be between 3 and 8 characters, start with a lowercase letter, and contain only lowercase letters and numbers (no spaces).",
        variant: "destructive",
      });
      return;
    }

    // Update Profile
    try {
      if (user && userId) {
        setUpdateLoading(true);
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          username: username,
          gender,
          dob: firestoreTimestamp,
          country,
        });
        const data = await getDoc(userRef);
        if (data.exists()) {
          setUser(data.data());
          setDrawerOpen(false);
        }
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Update User State
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setGender(user?.gender ? user.gender : "");
      setDate(user?.dob ? fromUnixTime(user.dob.seconds) : undefined);
      setCountry(user?.country ? user.country : "");
    }
  }, [user]);

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
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
                accessory={user ? user.avatar.accessories : ""}
                body={user ? user.avatar.body : ""}
                face={user ? user.avatar.face : ""}
                hair={user ? user.avatar.hair : ""}
                facialHair={user ? user.avatar.facialHair : ""}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
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
            {/* TODO: Date of Birth Component */}
            <DatePicker date={date} onDateChange={handleDateChange} />
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
                  {country
                    ? countries.find((data) => data.value === country)?.label
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
                      {countries.map((data) => (
                        <CommandItem
                          key={data.value}
                          value={data.value}
                          onSelect={(currentValue) => {
                            setCountry(
                              currentValue === country ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              country === data.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {data.label}
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
          <Button
            className="w-full"
            onClick={handleProfileUpdate}
            disabled={updateLoading}
          >
            {updateLoading ? <Loader2 className="animate-spin" /> : null}
            {updateLoading ? "Updating..." : "Update Profile"}
          </Button>
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
import { Particles } from "@/components/ui/particles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { accessories, body, face, facialHair, hair } from "./avatar";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { fromUnixTime } from "date-fns";
import { updateQueue } from "@/firebase/queue";
import { redirect } from "next/navigation";

export const Hero = () => {
  const { user, userId, loading } = useUserState((state) => state);
  const { toast } = useToast();
  const [searchLoading, setSearchLoading] = useState(false);

  // Handle Search
  const handleSearch = async () => {
    if (user && userId) {
      try {
        setSearchLoading(true);
        const result = await updateQueue(user, userId);
        if (result) {
          // Navigate to search screen
          redirect("/search");
        } else {
          toast({
            title: "Error",
            description: "Failed to search for partner. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error searching for partner", error);
        toast({
          title: "Error",
          description: "Failed to search for partner. Please try again.",
          variant: "destructive",
        });
      } finally {
        setSearchLoading(false);
      }
    }
  };

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
        <Button
          className="w-full"
          onClick={handleSearch}
          disabled={searchLoading || loading}
        >
          {searchLoading || loading ? (
            <Loader2 className="animate-spin" />
          ) : null}
          <Search /> Search
        </Button>
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
  const { user, userId, setUser } = useUserState((state) => state);
  const [avatarBackground, setAvatarBackground] = useState(
    user ? user.avatar.background : "#ffffff"
  );
  const [accessoryState, setAccessoryState] = useState(
    user ? user.avatar.accessories : ""
  );
  const [bodyState, setBodyState] = useState(user ? user.avatar.body : "");
  const [faceState, setFaceState] = useState(user ? user.avatar.face : "");
  const [hairState, setHairState] = useState(user ? user.avatar.hair : "");
  const [facialHairState, setFacialHairState] = useState(
    user ? user.avatar.facialHair : ""
  );
  const { toast } = useToast();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle Avatar Update
  const handleAvatarUpdate = async () => {
    if (
      !accessoryState ||
      !bodyState ||
      !faceState ||
      !hairState ||
      !facialHairState
    ) {
      toast({
        title: "Incomplete Avatar",
        description: "Please select all the avatar components.",
        variant: "destructive",
      });
      return;
    }

    // Avatar map data
    const avatar = {
      accessories: accessoryState,
      body: bodyState,
      face: faceState,
      hair: hairState,
      facialHair: facialHairState,
      background: avatarBackground,
    };

    // Update Avatar
    try {
      setUpdateLoading(true);
      if (user && userId) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { avatar });
        const data = await getDoc(userRef);
        if (data.exists()) {
          setUser(data.data());
          setDialogOpen(false);
        }
      }
    } catch (error) {
      console.error("Error updating avatar", error);
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        className="rounded-full"
        style={
          user
            ? { backgroundColor: user.avatar.background }
            : { backgroundColor: "white" }
        }
      >
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
            accessory={accessoryState}
            body={bodyState}
            face={faceState}
            hair={hairState}
            facialHair={facialHairState}
            strokeColor="black"
            backgroundColor="white"
          />
        </div>
        {/* Container */}
        <div className="grid grid-cols-2 justify-center items-center gap-2">
          {/* Accessories  */}
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="accessories">Accessories</Label>
            <Select
              onValueChange={(value) => setAccessoryState(value)}
              value={accessoryState}
            >
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
            <Select
              onValueChange={(value) => setBodyState(value)}
              value={bodyState}
            >
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
            <Select
              onValueChange={(value) => setFaceState(value)}
              value={faceState}
            >
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
            <Select
              onValueChange={(value) => setFacialHairState(value)}
              value={facialHairState}
            >
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
            <Select
              onValueChange={(value) => setHairState(value)}
              value={hairState}
            >
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
          <Button
            type="button"
            variant="default"
            className="w-fit"
            onClick={handleAvatarUpdate}
            disabled={updateLoading}
          >
            {updateLoading ? <Loader2 className="animate-spin" /> : null}
            {updateLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
