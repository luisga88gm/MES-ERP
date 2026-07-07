import { z } from "zod";

// Component schema with weight, cost and type
export const componentTypeEnum = z.enum(["connector", "chain"]);

export const insertComponentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  type: componentTypeEnum,
  stock: z.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  minStock: z.number().int("Minimum stock must be a whole number").min(0, "Minimum stock cannot be negative"),
  weight: z.number().min(0, "Weight cannot be negative"),
  cost: z.number().min(0, "Cost cannot be negative"),
  // Add bolt-related fields
  bolts: z.number().int().min(0).optional(),
  boltMeasurement: z.string().optional(),
  boltType: z.enum(["galvanizado", "inoxidable"]).optional(),
  // Add fields specific to connector type
  alWeight: z.number().min(0).optional(),
  brWeight: z.number().min(0).optional(),
  minutesPerPiece: z.number().min(0).optional(),
  // Add fields specific to morseteria type
  productProvider: z.string().optional(),
  treatment: z.string().optional(),
});

export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Component = InsertComponent & { id: number };

// Product types and schemas
export const productTypeEnum = z.enum(["connector", "chain"]);

export const productComponentSchema = z.object({
  componentId: z.number(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const insertProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  type: productTypeEnum,
  components: z.array(productComponentSchema),
  imageUrl: z.string().optional(),
  technicalDrawings: z.array(z.string()).optional(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = InsertProduct & {
  id: number;
  calculatedStock: number;
  totalWeight: number;
  totalCost: number;
};

// User schema with avatar support
export const insertUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().endsWith("@dynalab.com.ar", "Email must be a @dynalab.com.ar address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "user"]),
  avatar: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & { id: number };

export const insertWorkOrderSchema = z.object({
  title: z.string(),
  status: z.string(),
  client: z.string(),
  dueDate: z.string(),
  description: z.string().optional(),
  priority: z.string().default("medium"),
});

export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;
export type WorkOrder = InsertWorkOrder & { id: number };

export const insertClientSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = InsertClient & { id: number };

export const insertSupplierSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
});

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = InsertSupplier & { id: number };

export const insertSteelSchema = z.object({
  proveedor: z.string(),
  valorPesos: z.number(),
  valorUSD: z.number(),
  actualizadoEl: z.string(),
});

export type InsertSteel = z.infer<typeof insertSteelSchema>;
export type Steel = InsertSteel & { id: number };

export const insertQuotationSchema = z.object({
  clientId: z.number(),
  date: z.string(),
  status: z.string(),
  total: z.number(),
});

export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = InsertQuotation & { id: number };

export const insertOrderSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
  status: z.string(),
  orderDate: z.string(),
  deliveryDate: z.string().optional(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = InsertOrder & { id: number };

export const insertLogisticsSchema = z.object({
  orderId: z.number(),
  status: z.string(),
  location: z.string().optional(),
  updateDate: z.string(),
});

export type InsertLogistics = z.infer<typeof insertLogisticsSchema>;
export type Logistics = InsertLogistics & { id: number };

export const insertTransportSchema = z.object({
  vehicleId: z.string(),
  driver: z.string(),
  status: z.string(),
  currentLocation: z.string().optional(),
});

export type InsertTransport = z.infer<typeof insertTransportSchema>;
export type Transport = InsertTransport & { id: number };

export const insertVariableSchema = z.object({
  name: z.string(),
  value: z.string(),
  category: z.string(),
  description: z.string().optional(),
});

export type InsertVariable = z.infer<typeof insertVariableSchema>;
export type Variable = InsertVariable & { id: number };

export const insertProductionOrderSchema = z.object({
  workOrderId: z.number(),
  orderNumber: z.string(),
  client: z.string(),
  status: z.string(),
  dueDate: z.string(),
  products: z.array(z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number(),
    technicalDrawings: z.array(z.string()).optional(),
    rawMaterials: z.array(z.object({
      id: z.number(),
      name: z.string(),
      stockQuantity: z.number(),
      requiredQuantity: z.number(),
    })).optional(),
  })),
});

export type InsertProductionOrder = z.infer<typeof insertProductionOrderSchema>;
export type ProductionOrder = InsertProductionOrder & { id: number };

export const insertDeliveryNoteSchema = z.object({
  productionOrderId: z.number(),
  orderNumber: z.string(),
  client: z.string(),
  date: z.string(),
  status: z.string(),
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number(),
    selectedQuantity: z.number(),
    description: z.string().optional(),
    valuePerUnit: z.number().optional(),
  })),
  packages: z.array(z.object({
    number: z.number(),
    weight: z.number(),
    description: z.string().optional(),
  })),
  totalValue: z.number(),
  observations: z.string().optional(),
});

export type InsertDeliveryNote = z.infer<typeof insertDeliveryNoteSchema>;
export type DeliveryNote = InsertDeliveryNote & { id: number };

// Machine schema for Industry 4.0 monitoring
export const machineTypeEnum = z.enum(["CNC", "Torno", "Fresadora", "Corte Laser", "Prensa"]);
export const machineStatusEnum = z.enum(["RUNNING", "IDLE", "MAINTENANCE", "STOPPED"]);

export const insertMachineSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: machineTypeEnum,
  location: z.string(),
  status: machineStatusEnum,
  oee: z.number().min(0).max(100).default(85),
  availability: z.number().min(0).max(100).default(90),
  performance: z.number().min(0).max(100).default(95),
  quality: z.number().min(0).max(100).default(98),
  temperature: z.number().default(40),
  rpm: z.number().default(3000),
  currentOrder: z.string().optional(),
  operator: z.string().optional(),
});

export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type Machine = InsertMachine & { id: number };

// Traceability Schema (Genealogía de lote)
export const insertTraceabilitySchema = z.object({
  batchNumber: z.string(),
  productId: z.number(),
  productName: z.string(),
  rawMaterialBatch: z.string(),
  machineCode: z.string(),
  operator: z.string(),
  timestamp: z.string(),
  qualityPassed: z.boolean().default(true),
  notes: z.string().optional(),
});

export type InsertTraceability = z.infer<typeof insertTraceabilitySchema>;
export type TraceabilityRecord = InsertTraceability & { id: number };

// Alert Schema (Telemetría en tiempo real)
export const insertAlertSchema = z.object({
  machineCode: z.string(),
  severity: z.enum(["CRITICAL", "WARNING", "INFO"]),
  message: z.string(),
  timestamp: z.string(),
  acknowledged: z.boolean().default(false),
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = InsertAlert & { id: number };