import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { DateInput } from "@/components/ui/date-input";
import { Card, CardContent } from "@/components/ui/card";

type QuotationProduct = {
  name: string;
  quantity: number;
  price: number;
  description?: string;
};

type QuotationForm = {
  orderNumber: string;
  client: string;
  date: string;
  status: string;
  paymentMethod: string;
  deliveryMethod: string;
  validUntil: string;
  description?: string;
  attachments?: FileList;
  products: QuotationProduct[];
};

const quotations = [
  {
    id: 1,
    orderNumber: "0035/25",
    client: "Cliente A",
    date: "2024-03-01",
    status: "Pendiente",
    validUntil: "2024-04-01",
    paymentMethod: "100% anticipado",
    deliveryMethod: "Retiro en planta",
    description: "Descripción de la cotización A",
    products: [
      { name: "Producto A", quantity: 2, price: 1500, description: "Descripción del producto A" },
      { name: "Producto B", quantity: 1, price: 3000, description: "Descripción del producto B" }
    ]
  },
  // ... other quotations
];


export default function QuotationsPage() {
  const [open, setOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<typeof quotations[0] | null>(null);
  const [products, setProducts] = useState<QuotationProduct[]>([
    { name: "", quantity: 0, price: 0, description: "" }
  ]);
  const { toast } = useToast();

  const form = useForm<QuotationForm>({
    defaultValues: {
      orderNumber: "",
      client: "",
      date: format(new Date(), "yyyy-MM-dd"),
      status: "Pendiente",
      paymentMethod: "100% anticipado",
      deliveryMethod: "Retiro en planta",
      validUntil: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      products: [],
    },
  });

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: 0, price: 0, description: "" }]);
  };

  const updateProduct = (index: number, field: keyof QuotationProduct, value: string | number) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: field === 'name' || field === 'description' ? value : Number(value)
    };
    setProducts(newProducts);
  };

  const removeProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    if (newProducts.length === 0) {
      newProducts.push({ name: "", quantity: 0, price: 0, description: "" });
    }
    setProducts(newProducts);
  };

  const handleView = (quotation: typeof quotations[0]) => {
    setSelectedQuotation(quotation);
    setViewDialogOpen(true);
  };

  const handleEdit = (id: number) => {
    toast({
      title: "Editar Cotización",
      description: `Editando cotización ${id}`,
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Eliminar Cotización",
      description: `Eliminando cotización ${id}`,
    });
  };

  const onSubmit = async (data: QuotationForm) => {
    try {
      const formData = {
        ...data,
        products: products.filter(p => p.name && p.quantity > 0 && p.price > 0)
      };
      console.log(formData);
      toast({
        title: "Cotización Creada",
        description: "La cotización ha sido creada exitosamente.",
      });
      setOpen(false);
      form.reset();
      setProducts([{ name: "", quantity: 0, price: 0, description: "" }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear la cotización.",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = (products: QuotationProduct[]) => {
    return products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="text-cyan-500">📋</span>
            Cotizaciones
          </h1>
          <p className="text-xs text-slate-500 mt-1">Gestión de presupuestos y cotizaciones comerciales</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
              <Plus className="h-4 w-4" /> Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100">
            <DialogHeader className="flex flex-col space-y-1.5 text-center sm:text-left sticky top-0 bg-slate-900 z-10" style={{
              paddingRight: '0px',
              width: '740px',
              paddingBottom: '0px'
            }}>
              <DialogTitle className="text-slate-100">Crear Cotización</DialogTitle>
            </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="orderNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Cotización</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="0035/25" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="client"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nombre del cliente" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Emisión</FormLabel>
                            <FormControl>
                              <DateInput
                                {...field}
                                placeholder="Seleccionar fecha de emisión"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="validUntil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Válido Hasta</FormLabel>
                            <FormControl>
                              <DateInput
                                {...field}
                                placeholder="Seleccionar fecha de validez"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forma de Pago</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar forma de pago" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="100% anticipado">100% anticipado</SelectItem>
                                <SelectItem value="50% anticipado">50% anticipado</SelectItem>
                                <SelectItem value="30 días">30 días</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="deliveryMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forma de Entrega</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar forma de entrega" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Retiro en planta">Retiro en planta</SelectItem>
                                <SelectItem value="Transporte propio">Transporte propio</SelectItem>
                                <SelectItem value="Envío">Envío</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Descripción de la cotización" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="attachments"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Adjuntar PDF</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => onChange(e.target.files)}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Productos</h4>
                        <Button type="button" variant="outline" onClick={addProduct}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Producto
                        </Button>
                      </div>
                      {products.map((product, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_1fr_2fr_auto] gap-2 items-start">
                          <Input
                            placeholder="Nombre del producto"
                            value={product.name}
                            onChange={(e) => updateProduct(index, 'name', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Cantidad"
                            value={product.quantity || ''}
                            onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Precio unitario"
                            value={product.price || ''}
                            onChange={(e) => updateProduct(index, 'price', e.target.value)}
                          />
                          <Input
                            placeholder="Descripción del producto"
                            value={product.description}
                            onChange={(e) => updateProduct(index, 'description', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeProduct(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {products.length > 0 && (
                        <div className="text-right font-semibold">
                          Total: ${calculateTotal(products).toLocaleString()}
                        </div>
                      )}
                    </div>

            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
              Crear Cotización
            </Button>
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
              <th className="h-10 px-4 text-left font-medium text-slate-400">Número</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Cliente</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Fecha</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Estado</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400">Total</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400 w-[100px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation) => (
              <tr key={quotation.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-cyan-400 font-mono font-medium text-xs">{quotation.orderNumber}</td>
                <td className="p-4 text-slate-100">{quotation.client}</td>
                <td className="p-4 text-slate-400 font-mono text-xs">{formatDate(quotation.date)}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    quotation.status === 'Pendiente' ? 'bg-amber-500/20 text-amber-400' :
                    quotation.status === 'Aprobada' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>{quotation.status}</span>
                </td>
                <td className="p-4 text-slate-100 font-mono">${calculateTotal(quotation.products).toLocaleString()}</td>
                <td className="p-4">
                  <ActionIcons
                    onView={() => handleView(quotation)}
                    onEdit={() => handleEdit(quotation.id)}
                    onDelete={() => handleDelete(quotation.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader className="flex flex-col space-y-1.5 text-center sm:text-left sticky top-0 bg-slate-900 z-10" style={{
            paddingRight: '0px',
            width: '740px',
            paddingBottom: '0px'
          }}>
            <DialogTitle className="text-slate-100">Detalles de la Cotización</DialogTitle>
          </DialogHeader>
              {selectedQuotation && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">Número de Cotización</h4>
                      <p>{selectedQuotation.orderNumber}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Cliente</h4>
                      <p>{selectedQuotation.client}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Fecha de Emisión</h4>
                      <p>{formatDate(selectedQuotation.date)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Válido Hasta</h4>
                      <p>{formatDate(selectedQuotation.validUntil)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Estado</h4>
                      <p>{selectedQuotation.status}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Forma de Pago</h4>
                      <p>{selectedQuotation.paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Productos</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Precio Unitario</TableHead>
                          <TableHead>Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedQuotation.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>${product.price.toLocaleString()}</TableCell>
                            <TableCell>${(product.quantity * product.price).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-bold">Total:</TableCell>
                          <TableCell className="font-bold">
                            ${calculateTotal(selectedQuotation.products).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                      Cerrar
                    </Button>
                    <Button>
                      Imprimir Cotización
                    </Button>
                  </div>
                </div>
              )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}