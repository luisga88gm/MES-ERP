import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateDisplayProps {
  date: Date;
  className?: string;
}

export function DateDisplay({ date, className }: DateDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    const formatted = format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    // Split the string to capitalize the first letter and then the month name
    const parts = formatted.split(' de ');
    if (parts.length >= 2) {
      const [dayPart, month, year] = parts;
      const capitalizedDay = dayPart.charAt(0).toUpperCase() + dayPart.slice(1);
      const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
      return `${capitalizedDay} de ${capitalizedMonth} de ${year}`;
    }
    return formatted;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span 
          className={`cursor-pointer text-xl font-semibold text-muted-foreground ${className}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {formatDate(date)}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          disabled
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}