"use client";

import * as React from "react";
import { format, setMonth, setYear, subYears, startOfYear } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [calendarDate, setCalendarDate] = React.useState<Date>(
    startOfYear(subYears(new Date(), 18))
  );

  const minDate = subYears(new Date(), 99);
  const maxDate = subYears(new Date(), 18);

  const years = Array.from({ length: 82 }, (_, i) => maxDate.getFullYear() - i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleYearChange = (year: string) => {
    const newDate = setYear(calendarDate, Number.parseInt(year));
    setCalendarDate(newDate);
    if (date) {
      onDateChange(setYear(date, Number.parseInt(year)));
    }
  };

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(calendarDate, months.indexOf(month));
    setCalendarDate(newDate);
    if (date) {
      onDateChange(setMonth(date, months.indexOf(month)));
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    onDateChange(newDate);
    if (newDate) {
      setCalendarDate(newDate);
    }
    setIsCalendarOpen(false);
  };

  React.useEffect(() => {
    if (date) {
      setCalendarDate(date);
    }
  }, [date]);

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex items-center justify-between space-x-2 p-3">
          <Select
            value={calendarDate.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={months[calendarDate.getMonth()]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
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
          disabled={(date) => date > maxDate || date < minDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
