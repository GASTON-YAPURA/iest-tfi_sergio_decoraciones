# Sergio Decoraciones

Sitio web de Sergio Decoraciones, emprendimiento de decoración y terminaciones de interiores y exteriores en Tinogasta, Catamarca.

El sitio muestra los trabajos terminados y los servicios, y lleva a consultar por WhatsApp, por llamada o con un formulario. Incluye un panel privado donde Sergio ve las consultas recibidas.

## Stack

- Next.js (React)
- CSS con variables de la marca
- PostgreSQL (Neon)
- GitHub y Vercel

## Requisitos

- Node.js 20 o superior
- npm

## Puesta en marcha

```bash
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:3000`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm start` | Sirve la versión de producción |
| `npm test` | Ejecuta las pruebas con `node --test` |

## Variables de entorno

Las variables secretas se guardan en `.env.local` y nunca se suben al repositorio:

- `DATABASE_URL`
- `ADMIN_USUARIO`
- `ADMIN_CLAVE_HASH`
- `SESION_SECRETA`

## Documentación

La especificación completa está en `docs/`. Las reglas para la IA están en `AGENTS.md` y el estado del proyecto en `memory.md`.
