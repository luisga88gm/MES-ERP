import { 
  type User, type InsertUser, 
  type WorkOrder, type InsertWorkOrder, 
  type Product, type InsertProduct, 
  type Client, type InsertClient, 
  type Supplier, type InsertSupplier, 
  type Component, type InsertComponent,
  type ProductionOrder, type InsertProductionOrder,
  type DeliveryNote, type InsertDeliveryNote,
  type Machine, type InsertMachine,
  type TraceabilityRecord, type InsertTraceability,
  type Alert, type InsertAlert
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { hashPassword } from "./auth";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Work Orders
  getWorkOrders(): Promise<WorkOrder[]>;
  getWorkOrder(id: number): Promise<WorkOrder | undefined>;
  createWorkOrder(order: InsertWorkOrder): Promise<WorkOrder>;
  updateWorkOrder(id: number, order: Partial<InsertWorkOrder>): Promise<WorkOrder | undefined>;
  deleteWorkOrder(id: number): Promise<boolean>;

  // Production Orders
  getProductionOrders(): Promise<ProductionOrder[]>;
  getProductionOrder(id: number): Promise<ProductionOrder | undefined>;
  createProductionOrder(order: InsertProductionOrder): Promise<ProductionOrder>;
  updateProductionOrder(id: number, order: Partial<InsertProductionOrder>): Promise<ProductionOrder | undefined>;
  deleteProductionOrder(id: number): Promise<boolean>;

  // Delivery Notes (Remitos)
  getDeliveryNotes(): Promise<DeliveryNote[]>;
  getDeliveryNote(id: number): Promise<DeliveryNote | undefined>;
  createDeliveryNote(note: InsertDeliveryNote): Promise<DeliveryNote>;
  updateDeliveryNote(id: number, note: Partial<InsertDeliveryNote>): Promise<DeliveryNote | undefined>;
  deleteDeliveryNote(id: number): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Components
  getComponents(): Promise<Component[]>;
  getComponent(id: number): Promise<Component | undefined>;
  createComponent(component: InsertComponent): Promise<Component>;
  updateComponent(id: number, component: Partial<InsertComponent>): Promise<Component | undefined>;
  deleteComponent(id: number): Promise<boolean>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Machines
  getMachines(): Promise<Machine[]>;
  getMachine(id: number): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachine(id: number, machine: Partial<InsertMachine>): Promise<Machine | undefined>;
  deleteMachine(id: number): Promise<boolean>;

  // Traceability
  getTraceability(): Promise<TraceabilityRecord[]>;
  createTraceability(record: InsertTraceability): Promise<TraceabilityRecord>;

  // Alerts
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: number): Promise<Alert | undefined>;

  // Variables
  getVariables(): Promise<any>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workOrders: Map<number, WorkOrder>;
  private productionOrders: Map<number, ProductionOrder>;
  private deliveryNotes: Map<number, DeliveryNote>;
  private products: Map<number, Product>;
  private clients: Map<number, Client>;
  private suppliers: Map<number, Supplier>;
  private components: Map<number, Component>;
  private machines: Map<number, Machine>;
  private traceability: Map<number, TraceabilityRecord>;
  private alerts: Map<number, Alert>;
  private variables: any;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.workOrders = new Map();
    this.productionOrders = new Map();
    this.deliveryNotes = new Map();
    this.products = new Map();
    this.clients = new Map();
    this.suppliers = new Map();
    this.components = new Map();
    this.machines = new Map();
    this.traceability = new Map();
    this.alerts = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });

    this.variables = {
      bulonGalvanizado: [
        { medida: 'M8x25', precioUSD: 1.2, stock: 450 },
        { medida: 'M10x30', precioUSD: 1.8, stock: 320 },
        { medida: 'M12x40', precioUSD: 2.5, stock: 150 },
      ],
      bulonInoxidable: [
        { medida: 'M8x25', precioUSD: 2.8, stock: 200 },
        { medida: 'M10x30', precioUSD: 3.9, stock: 180 },
        { medida: 'M12x40', precioUSD: 5.4, stock: 90 },
      ],
    };
  }

  // User management
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const hashedPassword = await hashPassword(insertUser.password);
    const user: User = { ...insertUser, id, password: hashedPassword };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedData = { ...data };
    if (updatedData.password) {
      updatedData.password = await hashPassword(updatedData.password);
    }

    const updatedUser = { ...existingUser, ...updatedData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Work Orders
  async getWorkOrders(): Promise<WorkOrder[]> {
    return Array.from(this.workOrders.values());
  }

  async getWorkOrder(id: number): Promise<WorkOrder | undefined> {
    return this.workOrders.get(id);
  }

  async createWorkOrder(order: InsertWorkOrder): Promise<WorkOrder> {
    const id = this.currentId++;
    const workOrder: WorkOrder = { ...order, id };
    this.workOrders.set(id, workOrder);
    return workOrder;
  }

  async updateWorkOrder(id: number, data: Partial<InsertWorkOrder>): Promise<WorkOrder | undefined> {
    const existing = this.workOrders.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.workOrders.set(id, updated);
    return updated;
  }

  async deleteWorkOrder(id: number): Promise<boolean> {
    return this.workOrders.delete(id);
  }

  // Production Orders
  async getProductionOrders(): Promise<ProductionOrder[]> {
    return Array.from(this.productionOrders.values());
  }

  async getProductionOrder(id: number): Promise<ProductionOrder | undefined> {
    return this.productionOrders.get(id);
  }

  async createProductionOrder(order: InsertProductionOrder): Promise<ProductionOrder> {
    const id = this.currentId++;
    const prodOrder: ProductionOrder = { ...order, id };
    this.productionOrders.set(id, prodOrder);
    return prodOrder;
  }

  async updateProductionOrder(id: number, data: Partial<InsertProductionOrder>): Promise<ProductionOrder | undefined> {
    const existing = this.productionOrders.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.productionOrders.set(id, updated);
    return updated;
  }

  async deleteProductionOrder(id: number): Promise<boolean> {
    return this.productionOrders.delete(id);
  }

  // Delivery Notes
  async getDeliveryNotes(): Promise<DeliveryNote[]> {
    return Array.from(this.deliveryNotes.values());
  }

  async getDeliveryNote(id: number): Promise<DeliveryNote | undefined> {
    return this.deliveryNotes.get(id);
  }

  async createDeliveryNote(note: InsertDeliveryNote): Promise<DeliveryNote> {
    const id = this.currentId++;
    const delNote: DeliveryNote = { ...note, id };
    this.deliveryNotes.set(id, delNote);
    return delNote;
  }

  async updateDeliveryNote(id: number, data: Partial<InsertDeliveryNote>): Promise<DeliveryNote | undefined> {
    const existing = this.deliveryNotes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.deliveryNotes.set(id, updated);
    return updated;
  }

  async deleteDeliveryNote(id: number): Promise<boolean> {
    return this.deliveryNotes.delete(id);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct: Product = { 
      ...product, 
      id,
      calculatedStock: 0,
      totalWeight: 0,
      totalCost: 0
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Components
  async getComponents(): Promise<Component[]> {
    return Array.from(this.components.values());
  }

  async getComponent(id: number): Promise<Component | undefined> {
    return this.components.get(id);
  }

  async createComponent(component: InsertComponent): Promise<Component> {
    const id = this.currentId++;
    const newComponent: Component = { ...component, id };
    this.components.set(id, newComponent);
    return newComponent;
  }

  async updateComponent(id: number, data: Partial<InsertComponent>): Promise<Component | undefined> {
    const existing = this.components.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.components.set(id, updated);
    return updated;
  }

  async deleteComponent(id: number): Promise<boolean> {
    return this.components.delete(id);
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.currentId++;
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: number, data: Partial<InsertClient>): Promise<Client | undefined> {
    const existing = this.clients.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentId++;
    const newSupplier: Supplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: number, data: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existing = this.suppliers.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Machines
  async getMachines(): Promise<Machine[]> {
    return Array.from(this.machines.values());
  }

  async getMachine(id: number): Promise<Machine | undefined> {
    return this.machines.get(id);
  }

  async createMachine(machine: InsertMachine): Promise<Machine> {
    const id = this.currentId++;
    const newMachine: Machine = { ...machine, id };
    this.machines.set(id, newMachine);
    return newMachine;
  }

  async updateMachine(id: number, data: Partial<InsertMachine>): Promise<Machine | undefined> {
    const existing = this.machines.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.machines.set(id, updated);
    return updated;
  }

  async deleteMachine(id: number): Promise<boolean> {
    return this.machines.delete(id);
  }

  // Traceability
  async getTraceability(): Promise<TraceabilityRecord[]> {
    return Array.from(this.traceability.values());
  }

  async createTraceability(record: InsertTraceability): Promise<TraceabilityRecord> {
    const id = this.currentId++;
    const newRecord: TraceabilityRecord = { ...record, id };
    this.traceability.set(id, newRecord);
    return newRecord;
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.currentId++;
    const newAlert: Alert = { ...alert, id };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async acknowledgeAlert(id: number): Promise<Alert | undefined> {
    const existing = this.alerts.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, acknowledged: true };
    this.alerts.set(id, updated);
    return updated;
  }

  // Variables
  async getVariables(): Promise<any> {
    return this.variables;
  }
}

export const storage = new MemStorage();