import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "./button";
import { useAuth } from "@/hooks/use-auth";

interface ActionIconsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  adminOnly?: boolean;
}

export function ActionIcons({ onView, onEdit, onDelete, adminOnly = false }: ActionIconsProps) {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@dynalab.com.ar";

  if (adminOnly && !isAdmin) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {onView && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
          onClick={onView}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-500"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}