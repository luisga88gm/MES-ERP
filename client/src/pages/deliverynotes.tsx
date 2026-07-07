import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ActionIcons } from "@/components/ui/action-icons";
import { Badge } from "@/components/ui/badge";

export type DeliveryNoteForm = {
  orderNumber: string;
  client: string;
  date: string;
  status: string;
};

const deliveryNotes = [
  { id: 1, orderNumber: "REM-001", client: "Cliente A", date: "2025-02-26", status: "Pendiente" },
  { id: 2, orderNumber: "REM-002", client: "Cliente B", date: "2025-02-26", status: "Entregado" },
];

const statusConfig: Record<string, { label: string; classes: string }> = {
  Pendiente: { label: "Pendiente", classes: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  Entregado: { label: "Entregado", classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  Cancelado: { label: "Cancelado", classes: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
};

export default function DeliveryNotesPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<DeliveryNoteForm>({ defaultValues: { orderNumber: "", client: "", date: "", status: "" } });

  const handleView = (id: number) => toast({ title: "Ver Remito", description: `Viendo detalles del remito ${id}` });
  const handleEdit = (id: number) => toast({ title: "Editar Remito", description: `Editando remito ${id}` });
  const handleDelete = (id: number) => toast({ title: "Eliminar Remito", description: `Eliminando remito ${id}` });

  const onSubmit = async (data: DeliveryNoteForm) => {
    try {
      console.log(data);
      toast({ title: "Remito Creado", description: "El remito ha sido creado exitosamente." });
      setOpen(false);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Error al crear el remito.", variant: "destructive" });
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-500" />
            Remitos
          </h1>
          <p className="text-xs text-slate-500 mt-1">Gestión de remitos y notas de entrega</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
              <Plus className="h-4 w-4" /> Nuevo Remito
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Crear Remito</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="orderNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Número de Orden</FormLabel>
                    <FormControl><Input {...field} placeholder="REM-001" className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="client" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Cliente</FormLabel>
                    <FormControl><Input {...field} placeholder="Nombre del cliente" className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Fecha</FormLabel>
                    <FormControl><Input type="date" {...field} className="bg-slate-800 border-slate-700 text-slate-100" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Estado</FormLabel>
                    <FormControl><Input {...field} placeholder="Pendiente" className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">Crear Remito</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/70">
              <th className="h-10 px-4 text-left font-medium text-slate-400">N° Orden</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Cliente</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Fecha</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Estado</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400 w-[100px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deliveryNotes.map((note) => {
              const s = statusConfig[note.status] || { label: note.status, classes: "bg-slate-700 text-slate-400" };
              return (
                <tr key={note.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-cyan-400 font-mono font-medium text-xs">{note.orderNumber}</td>
                  <td className="p-4 text-slate-100">{note.client}</td>
                  <td className="p-4 text-slate-400 font-mono text-xs">{note.date}</td>
                  <td className="p-4"><Badge className={s.classes}>{s.label}</Badge></td>
                  <td className="p-4">
                    <ActionIcons onView={() => handleView(note.id)} onEdit={() => handleEdit(note.id)} onDelete={() => handleDelete(note.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
