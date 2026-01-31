**Pikuu** es una herramienta para desarrolladores que genera backend y UI productiva a partir de un esquema de datos o una idea inicial, usando un flujo de chat iterativo.

La aplicación está pensada como un **asistente técnico**, no como un generador genérico: cada mensaje del usuario modifica solo la parte del proyecto solicitada, manteniendo el estado completo del sistema.

Está enfocada 100% en el stack moderno de **Next.js + TypeScript**.

---

### Qué hace

* Genera `schema.prisma` desde una idea o lo consume directamente
* Genera schemas de validación con **Zod**
* Genera **Server Actions o Route Handlers** (no mezclados)
* Genera formularios reales con **shadcn/ui + TanStack Form**
* Mantiene un **estado persistente del proyecto**
* Permite iterar y modificar solo partes específicas
* Renderiza resultados como artifacts en streaming

---

### Stack

* Next.js (App Router)
* TypeScript (strict)
* Prisma + PostgreSQL
* Zod
* shadcn/ui
* TanStack Form
* AI SDK v6 (Vercel)
* AI Elements
* Framer Motion

---

### Filosofía

* Schema-first
* Type safety real
* Iteración controlada
* Sin código de ejemplo o placeholders
* Pensado para proyectos reales
