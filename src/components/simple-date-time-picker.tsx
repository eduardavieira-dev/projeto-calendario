import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SimpleDateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function SimpleDateTimePicker({
  value,
  onChange,
}: SimpleDateTimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(value.getHours());
      newDate.setMinutes(value.getMinutes());
      onChange(newDate);
    }
  }

  function handleTimeChange(type: "hour" | "minute", newValue: string) {
    const date = new Date(value);
    if (type === "hour") {
      date.setHours(Number(newValue));
    } else if (type === "minute") {
      date.setMinutes(Number(newValue));
    }
    onChange(date);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "PPp", { locale: ptBR })
          ) : (
            <span>Selecione data e hora</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="flex gap-2 border-t p-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Hora</label>
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      value.getHours() === hour && "bg-secondary"
                    )}
                    onClick={() => handleTimeChange("hour", String(hour))}
                  >
                    {hour.toString().padStart(2, "0")}:00
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Minuto</label>
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      value.getMinutes() === minute && "bg-secondary"
                    )}
                    onClick={() => handleTimeChange("minute", String(minute))}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
