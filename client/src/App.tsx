import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import WorkOrders from "@/pages/workorders";
import ProductionOrders from "@/pages/productionorders";
import Components from "@/pages/components";
import Products from "@/pages/products";
import Suppliers from "@/pages/suppliers";
import Clients from "@/pages/clients";
import Users from "@/pages/users";
import Quotations from "@/pages/quotations";
import Variables from "@/pages/variables";
import DeliveryNotes from "@/pages/deliverynotes";
import Logistics from "@/pages/logistics";
import AuthPage from "@/pages/auth-page";
import OEEMonitorPage from "@/pages/oee";
import TraceabilityPage from "@/pages/traceability";
import AlertsPage from "@/pages/alerts";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={Dashboard} />
          <ProtectedRoute path="/oee" component={OEEMonitorPage} />
          <ProtectedRoute path="/traceability" component={TraceabilityPage} />
          <ProtectedRoute path="/alerts" component={AlertsPage} />
          <ProtectedRoute path="/workorders" component={WorkOrders} />
          <ProtectedRoute path="/productionorders" component={ProductionOrders} />
          <ProtectedRoute path="/components" component={Components} />
          <ProtectedRoute path="/products" component={Products} />
          <ProtectedRoute path="/suppliers" component={Suppliers} />
          <ProtectedRoute path="/clients" component={Clients} />
          <ProtectedRoute path="/users" component={Users} />
          <ProtectedRoute path="/quotations" component={Quotations} />
          <ProtectedRoute path="/variables" component={Variables} />
          <ProtectedRoute path="/deliverynotes" component={DeliveryNotes} />
          <ProtectedRoute path="/logistics" component={Logistics} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;