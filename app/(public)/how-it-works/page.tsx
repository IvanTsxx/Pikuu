export default function HowItWorksPage() {
  return (
    <div className="container py-24 md:py-40">
      <h1 className="mb-12 font-black text-4xl uppercase tracking-tighter md:text-7xl">
        Cómo <span className="text-primary italic">funciona</span>
      </h1>
      <div className="grid max-w-4xl gap-12">
        <section className="space-y-4">
          <h2 className="font-bold font-mono text-2xl text-primary uppercase italic tracking-widest">
            01. Conexión de Idea
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Escribe tu idea de base de datos en lenguaje natural o sube tu
            archivo <code className="text-foreground">schema.prisma</code>{" "}
            actual. Nuestra IA analiza el contexto, las relaciones y las mejores
            prácticas de arquitectura.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-bold font-mono text-2xl text-primary uppercase italic tracking-widest">
            02. Generación Inteligente
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pikuu genera instantáneamente múltiples artefactos: el esquema de
            Prisma optimizado, esquemas de validación con{" "}
            <code className="text-foreground">Zod</code>, y la estructura de{" "}
            <code className="text-foreground">TanStack Form</code> para tu
            frontend.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-bold font-mono text-2xl text-primary uppercase italic tracking-widest">
            03. Refinamiento en tiempo real
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Utiliza nuestro chatbot especializado para pedir cambios: "Añade una
            relación muchos a muchos entre Usuarios y Proyectos" o "Cambia el
            tipo de ID a UUID". La IA actualiza todos los archivos de forma
            sincronizada.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-bold font-mono text-2xl text-primary uppercase italic tracking-widest">
            04. Implementación Instantánea
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Copia el código de los Server Actions o Route Handlers listos para
            usar. Todo el boilerplate de formularios con Shadcn y TanStack Form
            se genera automáticamente siguiendo los patrones de tu esquema.
          </p>
        </section>
      </div>
    </div>
  );
}
