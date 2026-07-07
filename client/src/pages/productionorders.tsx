import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus, Factory } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ActionIcons } from "@/components/ui/action-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InsertProductionOrder } from "@shared/schema";

// Sample work orders data
const workOrders = [
  { id: 1134, title: "WO-1134", client: "Cliente A", dueDate: "2025-03-24", products: [{ id: 1, name: "Producto A", quantity: 10 }] },
  { id: 1135, title: "WO-1135", client: "Cliente B", dueDate: "2025-03-25", products: [] }
];

export default function ProductionOrdersPage() {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<typeof workOrders[0] | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertProductionOrder>({
    defaultValues: {
      workOrderId: 0,
      orderNumber: "",
      client: "",
      status: "en fabricacion",
      dueDate: new Date().toISOString().split('T')[0],
      products: [],
    },
  });

  const handleWorkOrderSelect = (workOrderId: string) => {
    const workOrder = workOrders.find(wo => wo.id === parseInt(workOrderId));
    if (workOrder) {
      setSelectedWorkOrder(workOrder);
      form.setValue("workOrderId", workOrder.id);
      form.setValue("client", workOrder.client);
      form.setValue("dueDate", workOrder.dueDate);
      form.setValue("orderNumber", `OP-${workOrder.id}/25`);
      const products = workOrder.products.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        technicalDrawings: [],
        rawMaterials: [],
      }));
      form.setValue("products", products);
    }
  };

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setViewDetailsOpen(true);
  };

  const handleEdit = (id: number) => toast({ title: "Editar", description: `Editando ${id}` });
  const handleDelete = (id: number) => toast({ title: "Eliminar", description: `Eliminando ${id}` });
  const formatDate = (dateStr: string) => format(new Date(dateStr), "dd/MMM/yyyy", { locale: es }).toUpperCase();

  const onSubmit = async (data: InsertProductionOrder) => {
    console.log(data);
    toast({ title: "Orden de Producción Creada", description: "Éxito." });
    setOpen(false);
    form.reset();
    setSelectedWorkOrder(null);
  };

  const addMaterial = (productIndex: number) => {
    const currentProducts = form.getValues("products");
    const currentProduct = currentProducts[productIndex];
    currentProduct.rawMaterials = [
      ...(currentProduct.rawMaterials || []),
      { id: (currentProduct.rawMaterials?.length || 0) + 1, name: "", stockQuantity: 0, requiredQuantity: 0 }
    ];
    form.setValue("products", currentProducts);
  };

  const productionOrders = [
    { id: 1, workOrderId: 1134, orderNumber: "OP-1134/25", client: "Cliente A", status: "en fabricacion", dueDate: "2025-03-24", products: [{ id: 1, name: "Producto A", quantity: 10, technicalDrawings: ["d1.pdf"], rawMaterials: [{ id: 1, name: "Mat 1", stockQuantity: 100, requiredQuantity: 20 }] }] }
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Factory className="h-5 w-5 text-cyan-500" /> Órdenes de Producción
          </h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 text-white"><Plus className="h-4 w-4 mr-2" /> Nueva Orden</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-slate-100">
            <DialogHeader><DialogTitle>Crear Orden de Producción</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="workOrderId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden de Trabajo</FormLabel>
                    <Select onValueChange={handleWorkOrderSelect}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {workOrders.map((wo) => <SelectItem key={wo.id} value={wo.id.toString()}>{wo.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-cyan-600">Crear</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productionOrders.map((order) => (
              <TableRow key={order.id} className="border-slate-800">
                <TableCell className="text-cyan-400">{order.orderNumber}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell><ActionIcons onView={() => handleView(order)} onEdit={() => handleEdit(order.id)} onDelete={() => handleDelete(order.id)} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader><DialogTitle>Detalles</DialogTitle></DialogHeader>
          {selectedOrder && <div>{selectedOrder.orderNumber}</div>}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}