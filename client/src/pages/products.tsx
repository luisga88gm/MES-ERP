import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Package2, Plus, Cpu, Weight, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { InsertProduct, Product, productTypeEnum } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const insertProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  type: z.enum(["connector", "chain"]),
  components: z.array(z.object({ componentId: z.number(), quantity: z.number().min(1) })).optional(),
  technicalDrawings: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
});

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<"connector" | "chain">("connector");
  const [calculatedValues, setCalculatedValues] = useState({ stock: 0, weight: 0, cost: 0 });

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "connector",
      components: [],
      technicalDrawings: [],
      imageUrl: "",
    },
  });

  const { data: allComponents = [], isLoading: componentsLoading } = useQuery({
    queryKey: ["/api/components"],
    queryFn: () => fetch("/api/components").then(res => res.json()),
  });

  const availableComponents = allComponents.filter((c: any) => c.type === selectedType);

  const { data: products = [], isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => fetch("/api/products").then(res => res.json()),
  });

  const groupedProducts = {
    connectors: products.filter(p => p.type === "connector") || [],
    chains: products.filter(p => p.type === "chain") || []
  };

  useEffect(() => {
    const selectedComponents = form.watch("components") || [];
    let minStock = Infinity;
    let totalWeight = 0;
    let totalCost = 0;

    selectedComponents.forEach(comp => {
      const component = allComponents?.find((c: any) => c.id === comp.componentId);
      if (component && component.type === selectedType) {
        const availableStock = Math.floor(component.stock / comp.quantity);
        minStock = Math.min(minStock, availableStock);
        totalWeight += (component.weight || 0) * comp.quantity;
        totalCost += (component.cost || 0) * comp.quantity;
      }
    });

    setCalculatedValues({
      stock: minStock === Infinity ? 0 : minStock,
      weight: totalWeight,
      cost: totalCost
    });
  }, [form.watch("components"), allComponents, selectedType]);

  useEffect(() => {
    form.setValue("components", []);
    form.setValue("type", selectedType);
  }, [selectedType, form]);

  const handleComponentSelect = (componentId: number) => {
    const currentComponents = form.getValues("components") || [];
    const existingComponent = currentComponents.find(c => c.componentId === componentId);
    if (!existingComponent) {
      form.setValue("components", [...currentComponents, { componentId, quantity: 1 }]);
    }
  };

  const handleComponentRemove = (componentId: number) => {
    form.setValue("components", form.getValues("components").filter(c => c.componentId !== componentId));
  };

  const handleFileUpload = (files: FileList | null, field: "imageUrl" | "technicalDrawings") => {
    if (!files) return;
    if (field === "imageUrl") {
      form.setValue("imageUrl", files[0].name);
    } else {
      const fileNames = Array.from(files).map(f => f.name);
      form.setValue("technicalDrawings", fileNames);
    }
  };

  const onSubmit = async (data: InsertProduct) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({ title: "Producto Creado", description: "El producto ha sido creado exitosamente." });
        setOpen(false);
        form.reset();
        refetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating product");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const ProductTable = ({ data, title }: { data: Product[]; title: string }) => (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package2 className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            {data.length} SKUs
          </span>
        </div>
        {productsLoading ? (
          <div className="flex items-center gap-2 text-slate-400 py-8 justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500" />
            <span className="text-sm">Cargando catálogo...</span>
          </div>
        ) : productsError ? (
          <p className="text-rose-400 text-sm text-center py-4">Error al cargar productos</p>
        ) : data.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">Sin productos registrados</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-semibold">Nombre</TableHead>
                <TableHead className="text-slate-400 font-semibold">Descripción</TableHead>
                <TableHead className="text-slate-400 font-semibold">
                  <div className="flex items-center gap-1"><Package2 className="h-3.5 w-3.5" />Stock</div>
                </TableHead>
                <TableHead className="text-slate-400 font-semibold">
                  <div className="flex items-center gap-1"><Weight className="h-3.5 w-3.5" />Peso</div>
                </TableHead>
                <TableHead className="text-slate-400 font-semibold">
                  <div className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />Costo</div>
                </TableHead>
                <TableHead className="w-[100px] text-slate-400 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((product, index) => (
                <TableRow
                  key={product.id}
                  className={`border-b border-slate-800/40 ${index % 2 === 0 ? 'bg-slate-950/40' : 'bg-slate-900/40'} hover:bg-slate-800/30 transition-colors`}
                >
                  <TableCell className="text-slate-200 font-medium">{product.name}</TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[280px] truncate">{product.description}</TableCell>
                  <TableCell className={product.calculatedStock === 0 ? "text-rose-400 font-semibold font-mono" : "text-emerald-400 font-mono"}>
                    {product.calculatedStock}
                  </TableCell>
                  <TableCell className="text-slate-300 font-mono text-sm">{product.totalWeight.toFixed(2)} kg</TableCell>
                  <TableCell className="text-amber-400 font-mono text-sm">${product.totalCost.toFixed(2)}</TableCell>
                  <TableCell>
                    <ActionIcons onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Catálogo de Productos</h1>
              <p className="text-sm text-slate-400 mt-0.5">Gestión de SKUs, componentes y estructura BOM</p>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total SKUs", value: products.length, icon: Package2, color: "text-cyan-400" },
              { label: "Conectores", value: groupedProducts.connectors.length, icon: Cpu, color: "text-emerald-400" },
              { label: "Cadenas Morsetería", value: groupedProducts.chains.length, icon: Package2, color: "text-amber-400" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Products Tables */}
          <ProductTable data={groupedProducts.connectors} title="Conectores Eléctricos" />
          <ProductTable data={groupedProducts.chains} title="Cadenas de Morsetería" />
        </div>

        {/* Unified Modal via Modal.tsx */}
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Registrar Nuevo Producto"
          description="Complete los campos para agregar un SKU al catálogo productivo"
          maxWidth="max-w-4xl"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Tipo de Producto</FormLabel>
                    <Select
                      onValueChange={(value) => setSelectedType(value as "connector" | "chain")}
                      value={selectedType}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="connector" className="text-slate-100 hover:bg-slate-700">Conector Eléctrico</SelectItem>
                        <SelectItem value="chain" className="text-slate-100 hover:bg-slate-700">Cadena de Morsetería</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Nombre / SKU</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={`Nombre del ${selectedType === "connector" ? "conector" : "cadena"}`}
                          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Descripción Técnica</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Descripción del producto"
                          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3 border border-slate-700 rounded-xl p-4 bg-slate-950/40">
                <FormLabel className="text-base font-semibold text-slate-200">
                  Componentes de {selectedType === "connector" ? "Conector" : "Cadena"}
                </FormLabel>
                {componentsLoading ? (
                  <p className="text-slate-400 text-sm">Cargando componentes...</p>
                ) : (
                  <>
                    <Select onValueChange={(value) => handleComponentSelect(parseInt(value))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                        <SelectValue placeholder="Agregar componente al BOM" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {availableComponents.map((component: any) => (
                          <SelectItem key={component.id} value={component.id.toString()} className="text-slate-100">
                            {component.name} — Stock: {component.stock}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="space-y-2 mt-2">
                      {form.watch("components")?.map((comp, index) => {
                        const component = allComponents?.find((c: any) => c.id === comp.componentId);
                        if (!component) return null;
                        return (
                          <div key={index} className="flex gap-3 items-center bg-slate-900 border border-slate-700 p-3 rounded-lg">
                            <div className="flex-grow">
                              <div className="font-medium text-slate-200 text-sm">{component.name}</div>
                              <div className="text-xs text-slate-500">Stock: {component.stock} uds</div>
                            </div>
                            <Input
                              type="number"
                              min="1"
                              value={comp.quantity}
                              onChange={(e) => {
                                const newComponents = [...form.getValues("components")];
                                newComponents[index].quantity = parseInt(e.target.value);
                                form.setValue("components", newComponents);
                              }}
                              className="w-20 bg-slate-800 border-slate-600 text-slate-100 text-center"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleComponentRemove(comp.componentId)}
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                            >
                              ✕
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel className="text-slate-300 block mb-1.5">Imagen del Producto</FormLabel>
                  <Input type="file" accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, "imageUrl")}
                    className="bg-slate-800 border-slate-700 text-slate-300 file:text-slate-400" />
                </div>
                <div>
                  <FormLabel className="text-slate-300 block mb-1.5">Planos Técnicos (PDF)</FormLabel>
                  <Input type="file" accept=".pdf" multiple
                    onChange={(e) => handleFileUpload(e.target.files, "technicalDrawings")}
                    className="bg-slate-800 border-slate-700 text-slate-300 file:text-slate-400" />
                </div>
              </div>

              <Button type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold h-11">
                Crear {selectedType === "connector" ? "Conector" : "Cadena de Morsetería"}
              </Button>
            </form>
          </Form>
        </Modal>
      </div>
    </div>
  );
}