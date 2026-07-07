import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PackageSearch } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ActionIcons } from "@/components/ui/action-icons";

export type SupplierForm = {
  name: string;
  contact: string;
  email: string;
  phone: string;
};

const suppliers = [
  { id: 1, name: "Suministros ABC", contact: "Juan Pérez", email: "juan@abcsuministros.com", phone: "+54-11-5555-0123" },
  { id: 2, name: "Materiales XYZ", contact: "María García", email: "maria@xyzmateriales.com", phone: "+54-11-5555-0124" },
];

export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<SupplierForm>({ defaultValues: { name: "", contact: "", email: "", phone: "" } });

  const handleView = (id: number) => toast({ title: "Ver Proveedor", description: `Viendo detalles del proveedor ${id}` });
  const handleEdit = (id: number) => toast({ title: "Editar Proveedor", description: `Editando proveedor ${id}` });
  const handleDelete = (id: number) => toast({ title: "Eliminar Proveedor", description: `Eliminando proveedor ${id}` });

  const onSubmit = async (data: SupplierForm) => {
    try {
      console.log(data);
      toast({ title: "Proveedor Creado", description: "El proveedor ha sido creado exitosamente." });
      setOpen(false);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Error al crear el proveedor.", variant: "destructive" });
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PackageSearch className="h-5 w-5 text-cyan-500" />
            Proveedores
          </h1>
          <p className="text-xs text-slate-500 mt-1">Registro y gestión de proveedores</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
              <Plus className="h-4 w-4" /> Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Crear Proveedor</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Nombre de la Empresa</FormLabel>
                    <FormControl><Input {...field} placeholder="Nombre de la empresa" className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="contact" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Persona de Contacto</FormLabel>
                    <FormControl><Input {...field} placeholder="Nombre del contacto" className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Correo Electrónico</FormLabel>
                    <FormControl><Input type="email" {...field} placeholder="correo@empresa.com" className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Teléfono</FormLabel>
                    <FormControl><Input {...field} placeholder="+54 11 XXXX-XXXX" className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">Crear Proveedor</Button>
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
              <th className="h-10 px-4 text-left font-medium text-slate-400">Empresa</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Contacto</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Email</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Teléfono</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400 w-[100px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-slate-100 font-medium">{s.name}</td>
                <td className="p-4 text-slate-300">{s.contact}</td>
                <td className="p-4 text-slate-400 text-xs">{s.email}</td>
                <td className="p-4 text-slate-300 font-mono text-xs">{s.phone}</td>
                <td className="p-4">
                  <ActionIcons onView={() => handleView(s.id)} onEdit={() => handleEdit(s.id)} onDelete={() => handleDelete(s.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}