# CONSTITUCIÓN: principios de Sergio Decoraciones

Estos principios son cortos y comprobables. El agente de IA los lee antes de cada spec, plan o tarea, y no se saltea ninguno. Si un principio debe cambiar, primero se edita este archivo.

| N° | Principio | Cómo se comprueba |
|---|---|---|
| 1 | **Stack:** Next.js (React), PostgreSQL en Neon, GitHub y Vercel. No se agrega otra tecnología sin editar antes `docs/03-TECNOLOGIAS.md`. | `package.json` solo tiene las dependencias aprobadas en 03-TECNOLOGIAS.md |
| 2 | **Marca:** los colores y las tipografías salen siempre de las variables CSS de `IDENTIDAD-MARCA.md`. Ningún color se escribe a mano. | Buscar `#` y `rgb(` en `src/` y `app/` fuera de `globals.css` no devuelve resultados |
| 3 | **Capas:** la base de datos se usa solo desde `lib/db.js` y la sesión del panel solo desde `lib/sesion.js`. Los componentes no escriben SQL. | Ningún archivo de `components/` ni de `app/` importa el cliente de la base directamente |
| 4 | **Tests:** cada requerimiento de prioridad alta tiene al menos un test, y antes de cada commit pasan `npm test` y `npm run build`. | `npm test` y `npm run build` terminan sin errores |
| 5 | **Seguridad:** ningún secreto en el repositorio ni en el chat con la IA; el SQL va con parámetros y los formularios se validan en el servidor. | `.env.local` está en `.gitignore` y no aparece en el historial de commits |
| 6 | **Idioma:** el código va en español sin tildes y los textos para el cliente en español, con el tono de voz de la marca. Los commits empiezan con un verbo en presente. | `git log` y revisión de nombres según `docs/07-CONVENCIONES.md` |
| 7 | **Accesibilidad:** diseño mobile first desde 360 px, contraste adecuado, texto alternativo en toda imagen y navegación con teclado. | Lighthouse de 80 o más en Accesibilidad y alt presente en todas las imágenes |
| 8 | **Uso responsable de la IA:** toda pieza generada con IA lleva la leyenda "Generado con IA"; no se generan personas reales ni se imitan marcas; ningún código se acepta sin leerlo y entenderlo; no se ejecutan comandos sin mirarlos; no se pegan datos personales ni claves en un prompt. | Cada pieza tiene su ficha en `multimedia/FICHAS-IA.md` y existe `docs/DECLARACION-IA.md` |
