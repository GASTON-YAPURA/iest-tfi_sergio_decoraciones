# 03-TECNOLOGIAS: con qué construimos el sitio de Sergio Decoraciones

## Stack elegido

| Capa | Tecnología | Por qué la elegimos |
|---|---|---|
| Interfaz (frontend) | React | Componentes reutilizables: la tarjeta de trabajo y el botón de WhatsApp se escriben una vez y se usan en todo el sitio |
| Framework | Next.js | Rutas por carpetas, rutas de API y buen SEO para que Sergio aparezca en Google; además optimiza las fotos para cargar rápido (RNF02) |
| Estilos | CSS + variables | Los colores y tipografías de IDENTIDAD-MARCA.md se escriben una sola vez y se aplican en todo el sitio |
| Base de datos | PostgreSQL (Neon) | Guarda las consultas del formulario (RF07) y los trabajos de la galería; Neon tiene plan gratuito |
| Acceso a la base | `@neondatabase/serverless` | Driver oficial de Neon: permite consultas con `sql` y parámetros, y funciona en Vercel |
| Acceso al panel | Cookie de sesión + bcryptjs | La contraseña de Sergio se guarda cifrada (hash) y la sesión se protege con una cookie segura; no hace falta una base de usuarios porque hay un solo acceso |
| Pruebas | `node:test` | Viene incluido en Node.js: no agrega dependencias y permite probar validaciones, sesión y enlaces antes de cada commit |
| Repositorio | Git + GitHub | Historial de cambios del proyecto y respaldo del código |
| Publicación | Vercel | Publica el sitio en cada `git push` y entrega HTTPS (RNF05) |
| IA | OpenCode | Lee `AGENTS.md` y los archivos de `docs/` para escribir el código siguiendo las especificaciones |
| Editor | VS Code | Edición del código y vista previa de los archivos `.md` con `Ctrl + Shift + V` |

## Cómo se conecta todo

```text
Navegador (celular o PC del cliente)
        |  HTTPS
        v
Vercel + Next.js
  |-- Páginas React (inicio, servicios, trabajos, nosotros, contacto)
  |-- Rutas de API (/api/consultas, /api/trabajos, /api/admin)
  |-- lib/db.js  --> DATABASE_URL
                          |  SQL
                          v
                  PostgreSQL (Neon): trabajos y consultas

Computadora (VS Code + OpenCode) --git push--> GitHub --publica en cada push--> Vercel
```

## No usar en este proyecto

- Tailwind y Bootstrap: los estilos se escriben con CSS y variables
- Vue, Angular y jQuery: el proyecto usa solo React
- MongoDB y Firebase: la base de datos es PostgreSQL
- Prisma y TypeScript, por ahora
- Pasarelas de pago: el sitio no cobra online (ver 01-CONTEXTO.md)

## Variables de entorno

| Variable | Para qué sirve | ¿Puede llegar al navegador? |
|---|---|---|
| `DATABASE_URL` | Conexión a la base de datos en Neon | No, nunca |
| `ADMIN_USUARIO` | Nombre de usuario de Sergio para el panel | No, nunca |
| `ADMIN_CLAVE_HASH` | Contraseña de Sergio cifrada (hash bcrypt) | No, nunca |
| `SESION_SECRETA` | Clave para firmar la cookie de sesión | No, nunca |

## Pruebas

Se usa el ejecutor de pruebas incluido en Node.js (`node --test`), sin agregar dependencias. Los archivos de prueba viven en `test/` y se ejecutan con `npm test`. Antes de cada commit tienen que pasar `npm test` y `npm run build`.

## Cambios al stack

Esta lista es una decisión del proyecto, no una regla eterna. Si algo cambia, primero se edita este archivo y después el código.