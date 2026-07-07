import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Truck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ActionIcons } from "@/components/ui/action-icons";
import { Badge } from "@/components/ui/badge";

export type TransportForm = {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
};

const transporters = [
  { id: 1, name: "Transportes Express", contactPerson: "Juan Pérez", phone: "+54 11 1234-5678", email: "juan@transportesexpress.com", status: "active" },
  { id: 2, name: "Logística Rápida", contactPerson: "María García", phone: "+54 11 8765-4321", email: "maria@logisticarapida.com", status: "active" },
];

export default function LogisticsPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<TransportForm>({
    defaultValues: { name: "", contactPerson: "", phone: "", email: "", status: "active" },
  });

  const handleView = (id: number) => toast({ title: "Ver Transportista", description: `Viendo detalles del transportista ${id}` });
  const handleEdit = (id: number) => toast({ title: "Editar Transportista", description: `Editando transportista ${id}` });
  const handleDelete = (id: number) => toast({ title: "Eliminar Transportista", description: `¿Estás seguro de que deseas eliminar el transportista ${id}?` });

  const onSubmit = async (data: TransportForm) => {
    try {
      console.log(data);
      toast({ title: "Transportista Creado", description: "El transportista ha sido creado exitosamente." });
      setOpen(false);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Error al crear el transportista.", variant: "destructive" });
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Transportes
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Gestión de transportistas y logística</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Nuevo Transportista
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">Crear Transportista</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Nombre de la Empresa</FormLabel>
                    <FormControl><Input {...field} placeholder="Transportes Express" className="bg-input border-border text-foreground placeholder:text-muted-foreground" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="contactPerson" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Persona de Contacto</FormLabel>
                    <FormControl><Input {...field} placeholder="Juan Pérez" className="bg-input border-border text-foreground placeholder:text-muted-foreground" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Teléfono</FormLabel>
                    <FormControl><Input {...field} placeholder="+54 11 1234-5678" className="bg-input border-border text-foreground placeholder:text-muted-foreground" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Correo Electrónico</FormLabel>
                    <FormControl><Input {...field} type="email" placeholder="contacto@transportes.com" className="bg-input border-border text-foreground placeholder:text-muted-foreground" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="active" className="text-foreground focus:bg-accent focus:text-accent-foreground">Activo</SelectItem>
                        <SelectItem value="inactive" className="text-foreground focus:bg-accent focus:text-accent-foreground">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Crear Transportista</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Empresa</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Contacto</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Teléfono</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Email</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Estado</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground w-[100px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transporters.map((t) => (
              <tr key={t.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                <td className="p-4 text-foreground font-medium">{t.name}</td>
                <td className="p-4 text-muted-foreground">{t.contactPerson}</td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{t.phone}</td>
                <td className="p-4 text-muted-foreground text-xs">{t.email}</td>
                <td className="p-4">
                  <Badge className={t.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-secondary text-muted-foreground border-border'}>
                    {t.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="p-4">
                  <ActionIcons onView={() => handleView(t.id)} onEdit={() => handleEdit(t.id)} onDelete={() => handleDelete(t.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}