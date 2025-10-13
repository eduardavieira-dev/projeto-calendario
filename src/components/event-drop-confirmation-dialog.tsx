"use client";

import { format } from "date-fns";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { IEvent } from "@/components/interfaces";
import { formatTime, getColorClass } from "@/components/helpers";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/components/calendar-context";

interface EventDropConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: IEvent | null;
  newStartDate: Date | null;
  newEndDate: Date | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EventDropConfirmationDialog({
  open,
  onOpenChange,
  event,
  newStartDate,
  newEndDate,
  onConfirm,
  onCancel,
}: EventDropConfirmationDialogProps) {
  const { use24HourFormat } = useCalendar();

  if (!event || !newStartDate || !newEndDate) {
    return null;
  }

  const originalStart = new Date(event.startDate);

  const formatDate = (date: Date) => {
    return (
      format(date, "dd 'de' MMM yyyy 'às '") + formatTime(date, use24HourFormat)
    );
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Alteração</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja mover a consulta
            <span
              className={cn(
                getColorClass(event.color),
                "mx-1 py-0.5 px-1 rounded-md"
              )}
            >
              {event.title}
            </span>
            de
            <strong className="mx-1">{formatDate(originalStart)}</strong> para
            <strong className="mx-1">{formatDate(newStartDate)}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Mover Consulta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
