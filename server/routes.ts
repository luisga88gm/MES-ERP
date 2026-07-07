import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertUserSchema, insertComponentSchema, insertWorkOrderSchema, 
  insertProductSchema, insertClientSchema, insertSupplierSchema,
  insertProductionOrderSchema, insertDeliveryNoteSchema,
  insertMachineSchema, insertTraceabilitySchema, insertAlertSchema
} from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import passport from 'passport';

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration with env fallback
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dynalab-mes-industrial-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));

  // Setup authentication middleware  
  setupAuth(app);

  // Initialize admin user if it doesn't exist
  const adminUser = await storage.getUserByEmail("admin@dynalab.com.ar");
  if (!adminUser) {
    await storage.createUser({
      name: "Administrador MES",
      email: "admin@dynalab.com.ar", 
      password: process.env.ADMIN_PASSWORD || "admin1234",
      role: "admin"
    });
    console.log('Admin user initialized');
  }

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        return res.json(user);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Status endpoint
  app.get("/api/status", (_req, res) => {
    res.json({
      status: "running",
      system: "Dynalab MES Industria 4.0",
      timestamp: new Date().toISOString()
    });
  });

  // User management
  app.get("/api/me", requireAuth, (req, res) => {
    res.json(req.user);
  });

  app.get("/api/users", requireAuth, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAuth, async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);

      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertUserSchema.parse(req.body);

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const updatedUser = await storage.updateUser(id, data);
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Components routes
  app.get("/api/components", requireAuth, async (_req, res) => {
    try {
      const components = await storage.getComponents();
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  app.post("/api/components", requireAuth, async (req, res) => {
    try {
      const data = insertComponentSchema.parse(req.body);
      const component = await storage.createComponent(data);
      res.status(201).json(component);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create component" });
    }
  });

  // Work Orders routes
  app.get("/api/workorders", requireAuth, async (_req, res) => {
    try {
      const workOrders = await storage.getWorkOrders();
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch work orders" });
    }
  });

  app.post("/api/workorders", requireAuth, async (req, res) => {
    try {
      const data = insertWorkOrderSchema.parse(req.body);
      const workOrder = await storage.createWorkOrder(data);
      res.status(201).json(workOrder);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create work order" });
    }
  });

  // Production Orders routes (MES core)
  app.get("/api/productionorders", requireAuth, async (_req, res) => {
    try {
      const orders = await storage.getProductionOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch production orders" });
    }
  });

  app.post("/api/productionorders", requireAuth, async (req, res) => {
    try {
      const data = insertProductionOrderSchema.parse(req.body);
      const order = await storage.createProductionOrder(data);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create production order" });
    }
  });

  app.patch("/api/productionorders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateProductionOrder(id, req.body);
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update production order" });
    }
  });

  app.delete("/api/productionorders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProductionOrder(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete production order" });
    }
  });

  // Delivery Notes (Remitos) routes
  app.get("/api/deliverynotes", requireAuth, async (_req, res) => {
    try {
      const notes = await storage.getDeliveryNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivery notes" });
    }
  });

  app.post("/api/deliverynotes", requireAuth, async (req, res) => {
    try {
      const data = insertDeliveryNoteSchema.parse(req.body);
      const note = await storage.createDeliveryNote(data);
      res.status(201).json(note);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create delivery note" });
    }
  });

  // Products routes (Fixed promise handling with Promise.all)
  app.get("/api/products", requireAuth, async (_req, res) => {
    try {
      const products = await storage.getProducts();
      
      const productsWithCalculations = await Promise.all(products.map(async product => {
        let calculatedStock = Infinity;
        let totalWeight = 0;
        let totalCost = 0;

        if (product.components && Array.isArray(product.components)) {
          for (const comp of product.components) {
            const component = await storage.getComponent(comp.componentId);
            if (component) {
              const availableStock = Math.floor(component.stock / comp.quantity);
              calculatedStock = Math.min(calculatedStock, availableStock);
              totalWeight += (component.weight || 0) * comp.quantity;
              totalCost += (component.cost || 0) * comp.quantity;
            }
          }
        }

        return {
          ...product,
          calculatedStock: calculatedStock === Infinity ? 0 : calculatedStock,
          totalWeight,
          totalCost
        };
      }));

      res.json(productsWithCalculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Clients routes
  app.get("/api/clients", requireAuth, async (_req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", requireAuth, async (req, res) => {
    try {
      const data = insertClientSchema.parse(req.body);
      const client = await storage.createClient(data);
      res.status(201).json(client);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  // Suppliers routes
  app.get("/api/suppliers", requireAuth, async (_req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", requireAuth, async (req, res) => {
    try {
      const data = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(data);
      res.status(201).json(supplier);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  // Industry 4.0 Machines routes
  app.get("/api/machines", requireAuth, async (_req, res) => {
    try {
      const machines = await storage.getMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch machines" });
    }
  });

  app.post("/api/machines", requireAuth, async (req, res) => {
    try {
      const data = insertMachineSchema.parse(req.body);
      const machine = await storage.createMachine(data);
      res.status(201).json(machine);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create machine" });
    }
  });

  app.patch("/api/machines/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const machine = await storage.updateMachine(id, req.body);
      if (!machine) return res.status(404).json({ message: "Machine not found" });
      res.json(machine);
    } catch (error) {
      res.status(500).json({ message: "Failed to update machine" });
    }
  });

  // Industry 4.0 Traceability routes
  app.get("/api/traceability", requireAuth, async (_req, res) => {
    try {
      const records = await storage.getTraceability();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch traceability records" });
    }
  });

  app.post("/api/traceability", requireAuth, async (req, res) => {
    try {
      const data = insertTraceabilitySchema.parse(req.body);
      const record = await storage.createTraceability(data);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to record traceability" });
    }
  });

  // Industry 4.0 Telemetry Alerts routes
  app.get("/api/alerts", requireAuth, async (_req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", requireAuth, async (req, res) => {
    try {
      const data = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(data);
      res.status(201).json(alert);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  app.patch("/api/alerts/:id/acknowledge", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.acknowledgeAlert(id);
      if (!alert) return res.status(404).json({ message: "Alert not found" });
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // Variables routes
  app.get("/api/variables/bolts", requireAuth, async (_req, res) => {
    try {
      const variables = await storage.getVariables();
      const bolts = [
        ...((variables?.bulonGalvanizado || []).map((bolt: any) => ({
          ...bolt,
          id: `galv-${bolt.medida}`,
          type: 'galvanizado'
        }))),
        ...((variables?.bulonInoxidable || []).map((bolt: any) => ({
          ...bolt,
          id: `inox-${bolt.medida}`,
          type: 'inoxidable'
        })))
      ];
      res.json(bolts);
    } catch (error) {
      console.error("Error fetching bolts:", error);
      res.status(500).json({ message: "Failed to fetch bolt types" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}