import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ActionIcons } from "@/components/ui/action-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { formatDate } from "@/lib/format-date";

type OrderProduct = {
  name: string;
  quantity: number;
  price: number;
};

export type WorkOrderForm = {
  orderNumber: string;
  client: string;
  project: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  deliveryMethod: string;
  products: OrderProduct[];
};

const workOrders = [
  {
    id: 1,
    orderNumber: "1234/25",
    client: "Transba S.A.",
    project: "La Escondida 132 kV",
    dueDate: "2025-03-20",
    status: "En Progreso",
    paymentMethod: "100% anticipado",
    deliveryMethod: "Transporte propio",
    products: [
      { name: "Transformador 132kV", quantity: 1, price: 150000 },
    ]
  },
];

function WorkOrderDetailView({ order, onClose }: { order: typeof workOrders[0], onClose: () => void }) {
  const total = order.products.reduce((sum, product) => sum + (product.quantity * product.price), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div><h4 className="font-semibold mb-1">Número de Orden</h4><p>{order.orderNumber}</p></div>
        <div><h4 className="font-semibold mb-1">Cliente</h4><p>{order.client}</p></div>
        <div><h4 className="font-semibold mb-1">Obra</h4><p>{order.project}</p></div>
        <div><h4 className="font-semibold mb-1">Fecha de Vencimiento</h4><p>{formatDate(order.dueDate)}</p></div>
      </div>
      <Button variant="outline" onClick={onClose}>Cerrar</Button>
    </div>
  );
}

export default function WorkOrdersPage() {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof workOrders[0] | null>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<WorkOrderForm>({
    defaultValues: {
      orderNumber: "",
      client: "",
      project: "",
      status: "Pendiente",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      paymentMethod: "100% anticipado",
      deliveryMethod: "Retiro en planta",
      products: [],
    },
  });

  const onSubmit = async (data: WorkOrderForm) => {
    console.log(data);
    toast({ title: "Orden Creada", description: "Éxito." });
    setOpen(false);
    form.reset();
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-cyan-500" /> Órdenes de Trabajo
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 text-white gap-2"><Plus className="h-4 w-4" /> Nueva Orden</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[800px] bg-slate-900 border-slate-700 text-slate-100">
            <DialogHeader><DialogTitle>Crear Orden de Trabajo</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="orderNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="client" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
                <Button type="submit" className="w-full bg-cyan-600">Crear Orden</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead>Orden</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((order) => (
              <TableRow key={order.id} className="border-slate-800">
                <TableCell className="text-cyan-400">{order.orderNumber}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>
                  <ActionIcons
                    onView={() => { setSelectedOrder(order); setDetailViewOpen(true); }}
                    onEdit={() => { }}
                    onDelete={() => { }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogContent className="sm:max-w-[800px] bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader><DialogTitle>Detalles</DialogTitle></DialogHeader>
          {selectedOrder && <WorkOrderDetailView order={selectedOrder} onClose={() => setDetailViewOpen(false)} />}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}