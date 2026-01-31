"use client";

import {
  Code2,
  Cpu,
  Database,
  FormInput,
  Layout,
  Sparkles,
  Wand2,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Arquitecto Prisma IA",
    description:
      "Describe tu modelo de datos en lenguaje natural y deja que nuestra IA genere un schema.prisma optimizado y profesional.",
    icon: Database,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Iteración Inteligente",
    description:
      "¿Necesitas añadir una relación o cambiar un campo? Sube tu schema actual y pídele a la IA que lo evolucione por ti.",
    icon: Wand2,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Sincronización con Zod",
    description:
      "Generamos automáticamente esquemas de validación Zod que coinciden exactamente con tus modelos de base de datos.",
    icon: Code2,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Server Actions CRUD",
    description:
      "No más boilerplate. Crea, lee, actualiza y elimina con acciones de servidor generadas específicamente para tus modelos.",
    icon: Cpu,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Formularios Dinámicos",
    description:
      "React Hook Form + Zod + UI Components. Generamos los formularios completos para que solo tengas que copiarlos.",
    icon: FormInput,
    color: "from-red-500/20 to-rose-500/20",
  },
  {
    title: "Estructura Full-Stack",
    description:
      "Desde el diseño de la DB hasta la interfaz de usuario. Pikuu conecta todos los puntos de tu aplicación Next.js.",
    icon: Layout,
    color: "from-indigo-500/20 to-blue-500/20",
  },
];

export function Features() {
  return (
    <section className="container relative mx-auto overflow-hidden px-4 py-32">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-bold text-primary text-xs uppercase tracking-widest"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Potenciado por IA avanzada
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 font-black text-4xl text-foreground leading-[1.1] tracking-tight md:text-6xl"
        >
          Todo lo que necesitas para tu <br />
          <span className="bg-linear-to-r from-primary via-primary/60 to-primary/80 bg-clip-text text-transparent">
            capa de datos moderna
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl"
        >
          Pikuu no es una librería más, es una plataforma completa diseñada para
          que los ingenieros de Next.js dejen de escribir código repetitivo.
        </motion.p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col rounded-[2.5rem] border border-white/5 bg-card/50 p-10 shadow-vercel-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 hover:border-primary/20 hover:bg-muted/40 hover:shadow-2xl"
          >
            {/* Gradient background on hover */}
            <div
              className={`absolute inset-0 -z-10 rounded-[2.5rem] bg-linear-to-br ${feature.color} opacity-0 transition-opacity duration-500 hover:blur-xl group-hover:opacity-100`}
            />

            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary shadow-vercel-sm transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
              <feature.icon className="h-8 w-8" />
            </div>

            <h3 className="mb-4 font-bold text-2xl text-foreground tracking-tight transition-colors duration-300 group-hover:text-primary">
              {feature.title}
            </h3>

            <p className="text-lg text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
