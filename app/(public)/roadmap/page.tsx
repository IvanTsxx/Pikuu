export default function RoadmapPage() {
  const items = [
    {
      status: "Completado",
      title: "Generación de Prisma & Zod",
      date: "Q4 2025",
    },
    {
      status: "En curso",
      title: "Chatbot de Refinamiento de Esquemas",
      date: "Q1 2026",
    },
    {
      status: "Próximamente",
      title: "Soporte para TanStack Form (Full Gen)",
      date: "Q2 2026",
    },
    {
      status: "Planeado",
      title: "Integración Directa con VS Code Extension",
      date: "Q3 2026",
    },
    {
      status: "Investigando",
      title: "Migraciones Automáticas Seguras con IA",
      date: "Q4 2026",
    },
  ];

  return (
    <div className="container py-24 md:py-40">
      <h1 className="mb-12 font-black text-4xl uppercase tracking-tighter md:text-7xl">
        Nuestra <span className="text-primary italic">Ruta</span>
      </h1>
      <div className="max-w-2xl space-y-8">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative flex items-center gap-6 border-primary/20 border-l-2 pl-8"
          >
            <div className="absolute top-1/2 left-[-9px] h-4 w-4 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <div>
              <span className="font-bold font-mono text-[10px] text-primary uppercase tracking-widest">
                {item.status} — {item.date}
              </span>
              <h3 className="mt-1 font-bold text-foreground text-xl">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
