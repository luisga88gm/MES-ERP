import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  maxWidth = "max-w-lg"
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} bg-slate-900 border-slate-800 text-slate-100 rounded-2xl shadow-2xl p-6 antialiased`}>
        <DialogHeader className="border-b border-slate-800 pb-3 mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-100">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-slate-400 mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
