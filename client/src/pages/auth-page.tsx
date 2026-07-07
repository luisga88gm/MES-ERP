import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { z } from "zod";
import { Loader2, ShieldCheck, Mail, Lock } from "lucide-react";

const loginSchema = insertUserSchema.pick({
  email: true,
  password: true,
});

type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation } = useAuth();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (user) return <Redirect to="/" />;

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-slate-950 font-sans text-slate-100 overflow-hidden">

      {/* Columna Izquierda: Acceso */}
      <div className="flex items-center justify-center p-8 z-10">
        <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 shadow-2xl rounded-xl">
          <CardHeader className="text-center pb-6">
            <div className="h-20 w-20 mx-auto mb-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg">
              <img src="/assets/logo.png" alt="Dynalab Logo" className="h-14 w-14 object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Dynalab SRL</CardTitle>
            <CardDescription className="text-slate-400">Acceso a plataforma de gestión industrial</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit((d) => loginMutation.mutate(d as any))} className="space-y-4">
                <FormField control={loginForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="usuario@dynalab.com.ar" className="bg-slate-950 border-slate-800 h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={loginForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" /> Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••••" className="bg-slate-950 border-slate-800 h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-semibold py-2 mt-4" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Ingresar al Sistema"}
                </Button>
              </form>
            </Form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                ¿Problemas de acceso? Contacte a su supervisor o administrador de planta.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha: Industrial Branding */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-slate-900 relative border-l border-slate-800">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("https://cdn.create.vista.com/api/media/small/22347389/stock-photo-high-voltage-post")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Espaciador flexible para centrar el contenido principal */}
        <div className="flex-grow flex flex-col justify-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Gestión de Planta<br />
            <span className="text-cyan-500">Inteligente</span>
          </h1>
          <p className="text-slate-400 max-w-sm leading-relaxed">
            Plataforma MES corporativa. Monitoreo en tiempo real, trazabilidad de lotes y eficiencia operativa bajo estándares 4.0.
          </p>
        </div>

        {/* Footer de Copyright restaurado */}
        <div className="relative z-10 text-xs text-slate-500 pt-6 border-t border-slate-700">
          © 2025 Dynalab SRL • Acceso restringido a personal autorizado.
        </div>
      </div>
    </div>
  );
}