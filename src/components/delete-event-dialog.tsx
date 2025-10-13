import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/components/calendar-context";

interface DeleteEventDialogProps {
	eventId: number;
}

export default function DeleteEventDialog({ eventId }: DeleteEventDialogProps) {
	const { removeEvent } = useCalendar();

	const deleteEvent = () => {
		try {
			removeEvent(eventId);
			toast.success("Consulta excluída com sucesso.");
		} catch {
			toast.error("Erro ao excluir a consulta.");
		}
	};

	if (!eventId) {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">
					<TrashIcon />
					Excluir
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
						consulta e removerá os dados dos nossos servidores.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={deleteEvent}>Confirmar</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
