import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { UserList } from "@/components/users/user-list";
import { AddUser } from "@/components/users/add-user";
import { useAuth } from "@/hooks/use-auth";
import { Users } from "lucide-react";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Usuarios
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Gestión de usuarios y permisos del sistema</p>
        </div>
        {isAdmin && <AddUser />}
      </div>

      {/* Table Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <UserList />
      </div>
    </MainLayout>
  );
}