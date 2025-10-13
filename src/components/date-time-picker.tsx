import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/components/calendar-context";
import type { TEventFormData } from "@/components/schemas";

interface DatePickerProps {
  form: UseFormReturn<TEventFormData>;
  field: ControllerRenderProps<TEventFormData, "endDate" | "startDate">;
}

export function DateTimePicker({ form, field }: DatePickerProps) {
  const { use24HourFormat } = useCalendar();

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue(field.name, date);
    }
  }

  function handleTimeChange(type: "hour" | "minute", value: string) {
    const currentDate = form.getValues(field.name) || new Date();
    const newDate = new Date(currentDate);
    if (type === "hour") {
      newDate.setHours(Number(value));
    } else if (type === "minute") {
      newDate.setMinutes(Number(value));
    }
    form.setValue(field.name, newDate);
  }

  return (
    <FormItem>
      <FormLabel className="required">
        {field.name === "startDate" ? "Data de início" : "Data de término"}
      </FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value
                ? format(field.value, "dd/MM/yyyy HH:mm", { locale: ptBR })
                : "Selecione data e hora"}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={handleDateSelect}
            initialFocus
            locale={ptBR}
          />
          <div className="flex items-center gap-2 p-2">
            <select
              className="border rounded px-2 py-1"
              value={format(field.value || new Date(), "HH", { locale: ptBR })}
              onChange={(e) => handleTimeChange("hour", e.target.value)}
            >
              {[...Array(24).keys()].map((h) => (
                <option key={h} value={h.toString().padStart(2, "0")}>
                  {h.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              className="border rounded px-2 py-1"
              value={format(field.value || new Date(), "mm", { locale: ptBR })}
              onChange={(e) => handleTimeChange("minute", e.target.value)}
            >
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m.toString().padStart(2, "0")}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
