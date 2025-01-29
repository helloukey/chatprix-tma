"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
import { cn, countries } from "@/lib/utils";
import { Popover } from "@radix-ui/react-popover";
import { format } from "date-fns";
import {
  Bolt,
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useState } from "react";

const SettingsDrawer = () => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Drawer>
      <DrawerTrigger>
        <Bolt />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Profile</DrawerTitle>
          <DrawerDescription>
            Customize your profile to attract others
          </DrawerDescription>
        </DrawerHeader>
        <div className="w-full flex flex-col justify-center gap-4 px-4 my-8">
          <Avatar className="mx-auto">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Username</Label>
            <Input type="text" id="username" placeholder="johndoe" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Gender</Label>
            <Select>
              <SelectTrigger className="w-full">
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
            <Label htmlFor="email">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Date of Birth</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
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
                  className="w-full justify-between"
                >
                  {value
                    ? countries.find((country) => country.value === value)
                        ?.label
                    : "Select country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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

export default function Home() {
  return (
    <div className="w-full p-4">
      {/* Navbar */}
      <div className="w-full flex justify-end items-center">
        <SettingsDrawer />
      </div>
    </div>
  );
}
