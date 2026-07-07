import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function Navigation() {
  const { user } = useAuth();

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold">Dynalab ERP</a>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            ) : (
              <Link href="/auth">
                <a className="text-sm">Login</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}