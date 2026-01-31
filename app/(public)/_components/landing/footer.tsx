import { Database } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="text-left md:col-span-2">
            <Link href="/" className="group mb-8 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-transform duration-500 group-hover:rotate-12">
                <Database className="h-6 w-6 text-black" />
              </div>
              <span className="font-black text-2xl text-foreground uppercase italic tracking-tighter">
                PIKUU
              </span>
            </Link>
            <p className="mb-8 max-w-xs font-medium text-muted-foreground leading-relaxed">
              Arquitecta el futuro de tu capa de datos con Inteligencia
              Artificial. De la idea al código en segundos.
            </p>
          </div>

          <div className="text-left">
            <h4 className="mb-8 font-bold font-mono text-[10px] text-primary uppercase tracking-[0.3em]">
              Producto
            </h4>
            <ul className="space-y-4 font-medium text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Cómo funciona
                </Link>
              </li>

              <li>
                <Link
                  href="/roadmap"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="mb-8 font-bold font-mono text-[10px] text-primary uppercase tracking-[0.3em]">
              Legal
            </h4>
            <ul className="space-y-4 font-medium text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center justify-between gap-6 border-t-2 pt-8 md:flex-row">
          <p className="text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            © 2026 Pikuu AI — Potenciado por NEXT.JS
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Todos los sistemas operativos
              </span>
            </div>
            <Link
              href="#"
              className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest transition-colors hover:text-primary"
            >
              𝕏
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
