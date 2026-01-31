"use client";

import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthDialog, useAuth } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";

export function Hero() {
  const [prompt, setPrompt] = useState("");
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  const handleStart = () => {
    if (prompt.trim()) {
      localStorage.setItem("pikuu_initial_prompt", prompt);
    }

    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-10">
      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 font-bold font-mono text-[10px] text-primary uppercase tracking-[0.2em] backdrop-blur-md"
        >
          <span className="mr-2 flex h-2 w-2 animate-ping rounded-full bg-primary" />
          IA Sincronizada con tu Stack
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 max-w-5xl font-black text-5xl text-foreground leading-none tracking-tight md:text-4xl lg:text-7xl"
        >
          Agiliza tu desarrollo <br className="hidden md:block" />
          <span className="text-primary italic">con IA.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 max-w-3xl font-medium text-lg text-muted-foreground leading-relaxed md:text-2xl"
        >
          Genera o refina esquemas existentes de{" "}
          <code className="text-foreground">Prisma</code> o crea nuevos desde
          cero. Generamos <code className="text-foreground">Zod</code>,{" "}
          <code className="text-foreground">TanStack Form</code>, Server Actions
          y más.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-24 flex w-full flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <Button
            onClick={handleStart}
            className="h-16 px-12 font-black text-lg uppercase tracking-wider transition-all duration-200 hover:scale-105"
          >
            Empezar ahora
          </Button>
        </motion.div>

        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

        {/* Premium Demo / Functional Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="group relative mx-auto w-full max-w-4xl"
        >
          {/* Vercel-style card with glowing borders */}
          <div className="absolute -inset-1 rounded-4xl bg-linear-to-r from-primary/50 to-indigo-500/50 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />

          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-black shadow-2xl">
            {/* Header decoration */}
            <div className="flex items-center justify-between border-white/5 border-b bg-white/5 px-6 py-4 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full border border-red-500/50 bg-red-500/20 text-red-500" />
                <div className="h-3 w-3 rounded-full border border-yellow-500/50 bg-yellow-500/20 text-yellow-500" />
                <div className="h-3 w-3 rounded-full border border-green-500/50 bg-green-500/20 text-green-500" />
              </div>
              <div className="font-mono text-primary text-xs uppercase tracking-widest">
                Pikuu AI Terminal
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe tu base de datos ideal (ej: Un sistema de e-commerce con Usuarios, Productos, Pedidos y Reviews...)"
                  className="h-40 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-muted text-sm leading-relaxed outline-none transition-all placeholder:text-muted/50 focus:border-primary/50 focus:bg-white/10 focus:ring-0 dark:text-foreground dark:placeholder:text-muted-foreground/50"
                />
                <div className="absolute right-4 bottom-4">
                  <Button
                    size="sm"
                    onClick={handleStart}
                    className="gap-2 bg-primary/90 font-bold text-black hover:bg-primary"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generar Arquitectura
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-muted-foreground text-xs">
                <span>Sugerencias:</span>
                <button
                  type="button"
                  onClick={() =>
                    setPrompt("Sistema de gestión de inventario para farmacia")
                  }
                  className="text-muted/60 decoration-primary/50 transition-colors hover:text-primary hover:underline dark:text-muted-foreground/60 dark:hover:text-primary"
                >
                  Inventario Farmacia
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPrompt("App tipo Uber con conductores y pasajeros")
                  }
                  className="text-muted/60 decoration-primary/50 transition-colors hover:text-primary hover:underline dark:text-muted-foreground/60 dark:hover:text-primary"
                >
                  App Uber Clone
                </button>
              </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)]" />
          </div>
        </motion.div>
      </div>

      {/* Grid Pattern Background */}
      <div className="mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute top-[10%] right-[-5%] -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[100px]" />
    </section>
  );
}
