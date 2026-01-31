export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-24 md:py-40">
      <h1 className="mb-12 font-black text-4xl uppercase tracking-tighter md:text-7xl">
        Privacidad <span className="text-primary italic">Primero</span>
      </h1>
      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-bold text-2xl text-foreground">
            Tu código es tuyo
          </h2>
          <p>
            En Pikuu, no almacenamos tus esquemas de Prisma ni tus ideas para
            entrenar modelos públicos. Tu código se procesa de forma efímera
            para generar los resultados y se cifra en reposo si decides
            guardarlo en nuestra nube.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-2xl text-foreground">Seguridad</h2>
          <p>
            Utilizamos estándares de la industria para proteger tus datos. Tu
            conexión con nuestra IA es segura y privada.
          </p>
        </section>
      </div>
    </div>
  );
}
