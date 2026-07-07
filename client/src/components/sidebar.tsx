import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarSilhouette } from "@/components/ui/avatar-silhouette";
import {
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  Users,
  UserSquare2,
  Package,
  Menu,
  FileText,
  TrendingUp,
  Truck,
  Receipt,
  Settings,
  Handshake,
  Cpu,
  ShieldCheck,
  Bell
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navigation = [
    { name: "Panel Principal", href: "/", icon: LayoutDashboard },
    { name: "Monitor OEE 4.0", href: "/oee", icon: Cpu },
    { name: "Trazabilidad Lote", href: "/traceability", icon: ShieldCheck },
    { name: "Alertas Planta", href: "/alerts", icon: Bell },
    { name: "Órdenes Trabajo", href: "/workorders", icon: ClipboardList },
    { name: "Órdenes Producción", href: "/productionorders", icon: Settings },
    { name: "Componentes", href: "/components", icon: Package },
    { name: "Productos", href: "/products", icon: Package },
    { name: "Cotizaciones", href: "/quotations", icon: FileText },
    { name: "Variables", href: "/variables", icon: TrendingUp },
    { name: "Proveedores", href: "/suppliers", icon: Handshake },
    { name: "Clientes", href: "/clients", icon: UserSquare2 },
    { name: "Remitos", href: "/deliverynotes", icon: Receipt },
    { name: "Transportes", href: "/logistics", icon: Truck },
    { name: "Usuarios", href: "/users", icon: Users },
  ];

  const SidebarContent = ({ expanded = false }: { expanded?: boolean }) => (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-100 select-none">
      {/* Header Profile / Logo */}
      <div className="p-3 border-b border-slate-800/80 flex items-center gap-3 justify-start overflow-hidden">
        <div className="h-10 w-10 shrink-0 p-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shadow-md">
          <img src="/assets/logo.png" alt="Dynalab Logo" className="h-full w-full object-contain" />
        </div>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          <span className="font-bold text-sm block tracking-wide text-slate-100">Dynalab MES</span>
          <span className="text-[11px] text-cyan-400 block font-mono">Industria 4.0</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-2.5 border-b border-slate-800/60 flex items-center gap-2.5 bg-slate-950/40">
        <Avatar className="h-7 w-7 shrink-0 border border-slate-700">
          <AvatarFallback className="bg-slate-800 text-slate-300">
            <AvatarSilhouette className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          <span className="text-xs font-semibold block text-slate-200 truncate">{user?.name || "Administrador"}</span>
          <span className="text-[10px] text-slate-400 block capitalize">{user?.role || "admin"}</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-1 scrollbar-none">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                onClick={() => setMobileOpen(false)}
                title={!expanded ? item.name : undefined}
                className={`flex items-center h-9 px-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${isActive
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
              >
                <div className="shrink-0 flex items-center justify-center w-5">
                  <item.icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                </div>
                <span className={`ml-3 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout & Theme */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <div className={`flex-1 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 h-8 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/15"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile drawer */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-slate-900 border-slate-800 text-slate-200">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r border-slate-800 bg-slate-900">
            <SidebarContent expanded={true} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop collapsible sidebar with fluid CSS transition */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out shadow-2xl ${isHovered ? "w-56" : "w-16"
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarContent expanded={isHovered} />
      </aside>

      {/* Spacer to push main layout content */}
      <div className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${isHovered ? "w-56" : "w-16"}`} />
    </>
  );
}