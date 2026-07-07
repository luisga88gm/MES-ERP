import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <span className="text-xl font-bold">Dynalab</span>
          </a>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/workorders">Órdenes de Trabajo</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/productionorders">Producción</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/products">Productos</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/clients">Clientes</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/suppliers">Proveedores</Link>
          </Button>
          {user.role === 'admin' && (
            <Button variant="ghost" asChild>
              <Link href="/users">Usuarios</Link>
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}