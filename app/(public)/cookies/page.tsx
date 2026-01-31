export default function CookiesPage() {
  return (
    <div className="container max-w-4xl py-24 md:py-40">
      <h1 className="mb-12 font-black text-4xl uppercase tracking-tighter md:text-7xl">
        Política de <span className="text-primary italic">Cookies</span>
      </h1>
      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-bold text-2xl text-foreground">
            Cómo las usamos
          </h2>
          <p>
            Solo utilizamos cookies esenciales para mantener tu sesión iniciada
            y para análisis anónimos de rendimiento que nos ayudan a mejorar la
            herramienta para los desarrolladores.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-2xl text-foreground">Tu control</h2>
          <p>
            Puedes desactivar las cookies en cualquier momento desde la
            configuración de tu navegador, aunque esto podría afectar la
            funcionalidad de persistencia de sesión en Pikuu.
          </p>
        </section>
      </div>
    </div>
  );
}
