"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { format, parse, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarProvider } from "@/components/calendar-context";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";
import type { IEvent } from "@/components/interfaces";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCalendar } from "@/components/calendar-context";
import { NURSES, SERVICES } from "@/components/types/services";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type FormData = z.infer<typeof agendamentoSchema>;

const agendamentoSchema = z.object({
  nurseId: z.string().min(1, { message: "Selecione uma enfermeira" }),
  serviceId: z.string().min(1, { message: "Selecione um serviço" }),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"]),
  date: z
    .date()
    .refine((date) => date != null, { message: "Selecione uma data" })
    .refine((date) => date > new Date(), { message: "A data deve ser futura" }),
  time: z.string().min(1, { message: "Selecione um horário" }),
  notes: z.string(),
});
// Aqui esta sendo definido os horarios de 08:00 as 17:30 com intervalos de 30 minutos
const AVAILABLE_TIMES = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 8; // 8h às 17h
  return [
    `${hour.toString().padStart(2, "0")}:00`,
    `${hour.toString().padStart(2, "0")}:30`,
  ];
}).flat();

function AgendarPageContent() {
  const router = useRouter();
  const { addEvent } = useCalendar();

  const form = useForm<FormData>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      nurseId: "",
      serviceId: "",
      color: "blue",
      date: undefined as unknown as Date,
      time: "",
      notes: "",
    },
  });

  function onSubmit(data: FormData) {
    try {
      const service = SERVICES.find((s) => s.id === data.serviceId);
      const nurse = NURSES.find((n) => n.id === data.nurseId);
      if (!service) throw new Error("Serviço não encontrado");
      if (!nurse) throw new Error("Enfermeira não encontrada");

      // Combina data e hora
      const [hours, minutes] = data.time.split(":").map(Number);
      const startDate = setMinutes(setHours(data.date, hours), minutes);
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + service.duration);

      const event: IEvent = {
        id: Date.now(),
        title: service.name,
        observation: data.notes || "",
        nurse: nurse.name,
        service: service.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        color: data.color,
        user: {
          id: nurse.id,
          name: nurse.name,
          picturePath: nurse.picturePath,
        },
      };

      addEvent(event);
      toast.success("Consulta agendada com sucesso!");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao agendar consulta");
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Agendar Consulta</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Preencha seus dados para agendar
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-card p-6 rounded-lg border shadow-sm"
          >
            {/* Seleção de Enfermeira, Serviço e Cor */}
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="nurseId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Enfermeira</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a enfermeira" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NURSES.map((nurse) => (
                          <SelectItem key={nurse.id} value={nurse.id}>
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
                name="serviceId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tipo de Consulta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICES.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
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
                name="color"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Cor do card</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a cor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blue">Azul</SelectItem>
                        <SelectItem value="green">Verde</SelectItem>
                        <SelectItem value="red">Vermelho</SelectItem>
                        <SelectItem value="yellow">Amarelo</SelectItem>
                        <SelectItem value="purple">Roxo</SelectItem>
                        <SelectItem value="orange">Laranja</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="h-px bg-border" />
            {/* Data e Hora */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP", { locale: ptBR })
                              : "Selecione uma data"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return (
                              date < today ||
                              date.getDay() === 0 ||
                              date.getDay() === 6
                            );
                          }}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Horário</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_TIMES.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="h-px bg-border" />
            {/* Observações */}
            <div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Alguma informação importante?"
                        className="resize-none w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-4 flex flex-col gap-2">
              <Button type="submit" className="w-full">
                Agendar Consulta
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function AgendarPage() {
  return (
    <>
      <CalendarProvider users={[]} events={[]}>
        <AgendarPageContent />
      </CalendarProvider>
      <Toaster />
    </>
  );
}
