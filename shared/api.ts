import { apiRequest } from "../client/src/lib/queryClient";
import type { InsertUser, User, InsertWorkOrder, WorkOrder, InsertProduct, Product, InsertClient, Client, InsertSupplier, Supplier } from "./schema";

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    apiRequest("POST", "/api/login", { email, password }),
  logout: () => 
    apiRequest("POST", "/api/logout"),
  register: (userData: InsertUser) => 
    apiRequest("POST", "/api/register", userData),
  getMe: () => 
    apiRequest("GET", "/api/me")
};

// Work Orders API
export const workOrdersApi = {
  getAll: () => 
    apiRequest("GET", "/api/workorders"),
  create: (workOrder: InsertWorkOrder) => 
    apiRequest("POST", "/api/workorders", workOrder)
};

// Products API
export const productsApi = {
  getAll: () => 
    apiRequest("GET", "/api/products"),
  create: (product: InsertProduct) => 
    apiRequest("POST", "/api/products", product)
};

// Clients API
export const clientsApi = {
  getAll: () => 
    apiRequest("GET", "/api/clients"),
  create: (client: InsertClient) => 
    apiRequest("POST", "/api/clients", client)
};

// Suppliers API
export const suppliersApi = {
  getAll: () => 
    apiRequest("GET", "/api/suppliers"),
  create: (supplier: InsertSupplier) => 
    apiRequest("POST", "/api/suppliers", supplier)
};
