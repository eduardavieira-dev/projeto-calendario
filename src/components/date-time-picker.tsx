import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateChangeConfirmationDialog } from "@/components/date-change-confirmation-dialog";
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
  isEditing?: boolean;
}

export function DateTimePicker({ form, field, isEditing }: DatePickerProps) {
  const { use24HourFormat } = useCalendar();
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      const newDate = new Date(date);
      const currentDate = field.value || new Date();
      // Preserve current time
      newDate.setHours(currentDate.getHours());
      newDate.setMinutes(currentDate.getMinutes());
      form.setValue(field.name, newDate);
    }
  }

  function handleTimeChange(type: "hour" | "minute", value: string) {
    const currentDate = field.value || new Date();
    const newDate = new Date(currentDate);
    if (type === "hour") {
      newDate.setHours(Number(value));
    } else if (type === "minute") {
      newDate.setMinutes(Number(value));
    }
    form.setValue(field.name, newDate);
  }

  return (
    <>
      <FormItem>
        <FormLabel htmlFor={field.name} className="required">
          {field.name === "startDate" ? "Data inicial" : "Data final"}
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
                id={field.name}
                name={field.name}
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
              disabled={(date) => !isEditing && date < new Date()}
            />
            <div className="flex items-center gap-2 p-2">
              <select
                className="border rounded px-2 py-1"
                id={field.name + "-hour"}
                name={field.name + "-hour"}
                value={format(field.value || new Date(), "HH", {
                  locale: ptBR,
                })}
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
                id={field.name + "-minute"}
                name={field.name + "-minute"}
                value={format(field.value || new Date(), "mm", {
                  locale: ptBR,
                })}
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
    </>
  );
}
