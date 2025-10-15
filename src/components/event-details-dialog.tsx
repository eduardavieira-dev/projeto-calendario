"use client";

import { format, parseISO } from "date-fns";
import { Calendar, Clock, Text, User } from "lucide-react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalendar } from "@/components/calendar-context";
import { AddEditEventDialog } from "@/components/add-edit-event-dialog";
import { formatTime } from "@/components/helpers";
import type { IEvent } from "@/components/interfaces";

interface IProps {
  event: IEvent;
  children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { use24HourFormat, removeEvent } = useCalendar();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Responsável</p>
                <p className="text-sm text-muted-foreground">
                  {event.user.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data de Início</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "EEEE dd MMMM")}
                  <span className="mx-1">às</span>
                  {formatTime(parseISO(event.startDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data de Término</p>
                <p className="text-sm text-muted-foreground">
                  {format(endDate, "EEEE dd MMMM")}
                  <span className="mx-1">às</span>
                  {formatTime(parseISO(event.endDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Descrição</p>
                <p className="text-sm text-muted-foreground">
                  {event.observation}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="destructive"
            onClick={() => setIsDeleteConfirmationOpen(true)}
          >
            Cancelar Consulta
          </Button>
          <div className="flex gap-2">
            <AddEditEventDialog event={event}>
              <Button variant="default">Editar</Button>
            </AddEditEventDialog>
          </div>
        </div>
        <DialogClose />

        <DeleteConfirmationDialog
          isOpen={isDeleteConfirmationOpen}
          onConfirm={() => {
            removeEvent(event.id);
            toast.success("Consulta cancelada com sucesso");
            setIsDeleteConfirmationOpen(false);
          }}
          onCancel={() => setIsDeleteConfirmationOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
