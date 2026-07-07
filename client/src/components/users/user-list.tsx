import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActionIcons } from "@/components/ui/action-icons";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Camera } from "lucide-react";
import { EditUser } from "./edit-user";

function UserDetailView({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-muted">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-muted-foreground">{user.email}</p>
          <span className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${
            user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }`}>
            {user.role === "admin" ? "Administrador" : "Usuario"}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
}

export function UserList() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Cargando usuarios...</p>
      </div>
    );
  }

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDetailViewOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = (user: User) => {
    toast({
      title: "Eliminar Usuario",
      description: `¿Estás seguro de eliminar a ${user.name}?`,
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px]">Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-muted">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {user.role === "admin" ? "Administrador" : "Usuario"}
                </span>
              </TableCell>
              <TableCell>
                <ActionIcons
                  onView={() => handleView(user)}
                  onEdit={() => handleEdit(user)}
                  onDelete={() => handleDelete(user)}
                />
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center"
              >
                <p className="text-muted-foreground">
                  No hay usuarios registrados
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={detailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserDetailView
              user={selectedUser}
              onClose={() => setDetailViewOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      <EditUser
        user={editingUser!}
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      />
    </>
  );
}