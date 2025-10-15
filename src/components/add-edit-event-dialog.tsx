import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, format, set } from "date-fns";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChangeConfirmationDialog } from "@/components/change-confirmation-dialog";
import { DateTimePicker } from "@/components/date-time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/responsive-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COLORS } from "@/components/constants";
import { useCalendar } from "@/components/calendar-context";
import { useDisclosure } from "@/components/hooks";
import type { IEvent } from "@/components/interfaces";
import { eventSchema, type TEventFormData } from "@/components/schemas";
import { NURSES, SERVICES } from "@/components/types/services";

interface IProps {
  children: ReactNode;
  startDate?: Date;
  startTime?: { hour: number; minute: number };
  event?: IEvent;
}

export function AddEditEventDialog({
  children,
  startDate,
  startTime,
  event,
}: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { addEvent, updateEvent } = useCalendar();
  const isEditing = !!event;
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [formValues, setFormValues] = useState<TEventFormData | null>(null);

  const initialDates = useMemo(() => {
    if (!isEditing && !event) {
      if (!startDate) {
        const now = new Date();
        return { startDate: now, endDate: addMinutes(now, 30) };
      }
      const start = startTime
        ? set(new Date(startDate), {
            hours: startTime.hour,
            minutes: startTime.minute,
            seconds: 0,
          })
        : new Date(startDate);
      const end = addMinutes(start, 30);
      return { startDate: start, endDate: end };
    }

    return {
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    };
  }, [startDate, startTime, event, isEditing]);

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title ?? "",
      observation: event?.observation ?? "",
      startDate: event ? new Date(event.startDate) : initialDates.startDate,
      endDate: event ? new Date(event.endDate) : initialDates.endDate,
      nurse: event?.nurse ?? "",
      service: event?.service ?? "",
      color: event?.color ?? "blue",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const getSafeDate = (date: unknown) => {
        if (date instanceof Date) return date;
        if (typeof date === "string" || typeof date === "number")
          return new Date(date);
        return new Date();
      };

      const allowedColors = [
        "blue",
        "green",
        "red",
        "yellow",
        "purple",
        "orange",
      ] as const;
      const getSafeColor = (color: unknown): (typeof allowedColors)[number] => {
        return allowedColors.includes(color as (typeof allowedColors)[number])
          ? (color as (typeof allowedColors)[number])
          : "blue";
      };

      const formValues: TEventFormData = event
        ? {
            title: event.title ?? "",
            nurse: event.nurse ?? "",
            service: event.service ?? "",
            observation: event.observation ?? "",
            startDate: getSafeDate(event.startDate),
            endDate: getSafeDate(event.endDate),
            color: getSafeColor(event.color),
          }
        : {
            title: "",
            nurse: "",
            service: "",
            observation: "",
            startDate: getSafeDate(initialDates.startDate),
            endDate: getSafeDate(initialDates.endDate),
            color: "blue",
          };

      // Resetar o formulário com os valores corretos
      form.reset(formValues, {
        keepDefaultValues: true,
      });
    }
  }, [event, initialDates, form, isOpen]);

  const onSubmit = async (values: TEventFormData) => {
    // Validação adicional das datas
    if (
      !(values.startDate instanceof Date) ||
      !(values.endDate instanceof Date)
    ) {
      toast.error("Datas inválidas");
      return;
    }

    // Validar se a data de início é menor que a data de fim
    if (values.startDate >= values.endDate) {
      toast.error("A data de início deve ser menor que a data de fim");
      return;
    }

    // Validar a duração do evento com base no serviço selecionado
    const selectedService = SERVICES.find((s) => s.name === values.service);
    if (selectedService) {
      const duration =
        (values.endDate.getTime() - values.startDate.getTime()) / (1000 * 60); // em minutos
      if (duration !== selectedService.duration) {
        toast.error(
          `A duração deve ser de ${selectedService.duration} minutos para ${selectedService.name}`
        );
        return;
      }
    }

    // Se estiver editando, mostrar confirmação para qualquer mudança
    if (isEditing && event) {
      const hasChanges =
        values.startDate.getTime() !== new Date(event.startDate).getTime() ||
        values.endDate.getTime() !== new Date(event.endDate).getTime() ||
        values.service !== event.service ||
        values.observation !== event.observation ||
        values.color !== event.color;

      if (hasChanges) {
        setFormValues(values);
        setIsConfirmationOpen(true);
        return;
      }
    }

    await handleSaveEvent(values);
  };

  const handleSaveEvent = (values: TEventFormData) => {
    try {
      // Garantir que temos objetos Date válidos
      const startDate =
        values.startDate instanceof Date
          ? values.startDate
          : new Date(values.startDate);
      const endDate =
        values.endDate instanceof Date
          ? values.endDate
          : new Date(values.endDate);

      const formattedEvent: IEvent = {
        ...values,
        startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        id: isEditing ? event!.id : Math.floor(Math.random() * 1000000),
        user: isEditing
          ? event!.user
          : {
              id: Math.floor(Math.random() * 1000000).toString(),
              name: "Jeraidi Yassir",
              picturePath: null,
            },
        color: values.color,
        observation: values.observation || "",
      };

      if (isEditing) {
        updateEvent(formattedEvent);
        toast.success("Consulta atualizada com sucesso");
      } else {
        addEvent(formattedEvent);
        toast.success("Consulta criada com sucesso");
      }

      onClose();
      form.reset();
      setIsConfirmationOpen(false);
      setFormValues(null);
    } catch (error) {
      console.error(
        `Erro ao ${isEditing ? "editar" : "adicionar"} consulta:`,
        error
      );
      toast.error(`Falha ao ${isEditing ? "editar" : "adicionar"} consulta`);
    }
  };

  const handleConfirmDateChange = () => {
    if (formValues) {
      handleSaveEvent(formValues);
    }
  };

  const handleCancelDateChange = () => {
    setIsConfirmationOpen(false);
    setFormValues(null);
    // Restaurar valores originais
    if (event) {
      form.setValue("startDate", new Date(event.startDate));
      form.setValue("endDate", new Date(event.endDate));
    }
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onToggle} modal={false}>
        <ModalTrigger asChild>{children}</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {isEditing ? "Editar Consulta" : "Nova Consulta"}
            </ModalTitle>
            <ModalDescription>
              {isEditing
                ? "Altere os detalhes da consulta."
                : "Agende uma nova consulta no calendário."}
            </ModalDescription>
          </ModalHeader>

          <Form {...form}>
            <form
              id="event-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="required">Tipo da Consulta</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selectedService = SERVICES.find(
                          (s) => s.name === value
                        );
                        if (selectedService) {
                          // Atualiza o serviço
                          field.onChange(value);

                          // Atualiza o título para corresponder ao serviço
                          form.setValue("title", value, { shouldDirty: true });

                          // Ajusta a duração com base no serviço selecionado
                          const startDate = form.getValues("startDate");
                          if (startDate instanceof Date) {
                            const endDate = addMinutes(
                              startDate,
                              selectedService.duration
                            );
                            form.setValue("endDate", endDate, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }

                          // Se não houver enfermeira selecionada, seleciona a primeira disponível
                          const currentNurse = form.getValues("nurse");
                          if (!currentNurse && NURSES.length > 0) {
                            form.setValue("nurse", NURSES[0].name, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo da consulta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICES.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            <div>
                              <div>{service.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {service.duration}min
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nurse"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="required">Enfermeira</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a enfermeira" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NURSES.map((nurse) => (
                          <SelectItem key={nurse.id} value={nurse.name}>
                            {nurse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observation"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="observation">Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="observation"
                        name="observation"
                        placeholder="Digite observações (opcional)"
                        className={fieldState.invalid ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <DateTimePicker
                    form={form}
                    field={field}
                    isEditing={isEditing}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <DateTimePicker
                    form={form}
                    field={field}
                    isEditing={isEditing}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">Cor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COLORS.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-4 rounded-full ${
                                  color.value === "blue"
                                    ? "bg-blue-500"
                                    : color.value === "green"
                                    ? "bg-green-500"
                                    : color.value === "red"
                                    ? "bg-red-500"
                                    : color.value === "yellow"
                                    ? "bg-yellow-500"
                                    : color.value === "purple"
                                    ? "bg-purple-500"
                                    : "bg-orange-500"
                                }`}
                              />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <ModalFooter className="flex justify-end gap-2">
            <ModalClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </ModalClose>
            <Button form="event-form" type="submit" variant="default">
              {isEditing ? "Salvar Alterações" : "Criar Evento"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ChangeConfirmationDialog
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirmDateChange}
        onCancel={handleCancelDateChange}
        title="Confirmar alterações"
        description="Tem certeza que deseja salvar as alterações feitas nesta consulta?"
      />
    </>
  );
}
