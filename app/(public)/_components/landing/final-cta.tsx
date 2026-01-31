"use client";

import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { AuthDialog } from "../../../../components/auth-dialog";
import { Button } from "../../../../components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="container relative z-10 mx-auto px-4">
        <div className="relative mx-auto max-w-4xl shrink-0 overflow-hidden rounded border border-primary/20 bg-black p-12 text-center shadow-[20px_20px_0px_0px_rgba(var(--primary),0.05)] md:p-24">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-0 -z-10 h-full w-full">
            <div className="absolute top-1/2 left-1/4 h-64 w-64 animate-pulse rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute right-1/4 bottom-1/4 h-64 w-64 animate-pulse rounded-full bg-indigo-500/5 blur-[100px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded border border-primary/30 bg-primary/5 px-4 py-1.5 font-bold font-mono text-[10px] text-primary uppercase tracking-[0.2em]"
          >
            <Sparkles className="h-3 w-3" />
            Listo para escalar
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 font-black text-5xl text-muted uppercase leading-none tracking-tighter md:text-7xl dark:text-foreground"
          >
            Menos Boilerplate. <br />
            <span className="text-primary italic">Más innovación.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-12 max-w-2xl font-medium text-lg text-muted-foreground md:text-xl"
          >
            Únete a cientos de desarrolladores que ya están usando Pikuu para
            construir el futuro de sus aplicaciones Next.js.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center gap-6 sm:flex-row"
          >
            <AuthDialog>
              <Button
                size="lg"
                className="h-16 rounded-none bg-primary px-12 font-black text-lg text-primary-foreground uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(var(--primary),0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                Comenzar gratis
              </Button>
            </AuthDialog>
            <Button
              variant="outline"
              size="lg"
              className="h-16 rounded-none border-2 border-primary/20 bg-background px-12 font-black text-lg uppercase tracking-widest transition-all hover:border-primary hover:bg-primary/5"
            >
              Probar ahora
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
