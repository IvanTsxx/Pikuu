"use client";

import { ArrowRight, Code2, Cpu, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    title: "Define tu idea",
    description:
      "Escribe lo que necesitas en lenguaje natural. No te preocupes por la sintaxis técnica, la IA entiende tu visión.",
    icon: Lightbulb,
  },
  {
    title: "Refina con IA",
    description:
      "Nuestra IA genera el esquema de Prisma y te permite iterar hasta que sea perfecto. Relaciones, tipos y enums manejados automáticamente.",
    icon: Cpu,
  },
  {
    title: "Obtén tu código",
    description:
      "Descarga o copia el esquema Prisma, validaciones Zod, Server Actions y formularios listos para integrar en tu app.",
    icon: Code2,
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-20 text-center">
          <h2 className="mb-4 font-bold text-3xl text-foreground leading-tight tracking-tight md:text-5xl">
            De la idea al código en{" "}
            <span className="text-primary">3 pasos</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Simplificamos el proceso de diseño de base de datos para que te
            enfoques en lo que importa: tu producto.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
          {/* Connection line for desktop */}
          <div className="absolute top-1/2 left-0 mt-2 hidden h-0.5 w-full -translate-y-1/2 bg-linear-to-r from-transparent via-primary/20 to-transparent md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-xl">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-3 font-bold text-xl">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="mt-6 md:hidden">
                  <ArrowRight className="h-6 w-6 rotate-90 text-primary" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
