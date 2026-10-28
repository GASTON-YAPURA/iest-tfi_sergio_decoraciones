# 08-TAREAS: en qué orden construimos el sitio de Sergio Decoraciones

La IA trabaja una tarea por vez, en orden, y la marca con `[x]` al terminarla. Antes de empezar cada etapa lee los archivos de `docs/` que le corresponden.

| Etapa | Nombre | Requerimientos |
|---|---|---|
| 1 | Preparación | RNF06 |
| 2 | Base de datos | RF01, RF07 |
| 3 | Estructura común y contacto | RF05, RF06 |
| 4 | Inicio y servicios | RF04 |
| 5 | Trabajos | RF01, RF02, RF03 |
| 6 | Nosotros y consulta | RF07, RF08 |
| 7 | Panel privado de consultas | RF09, RF10, RF11, RNF07 |
| 8 | Calidad y publicación | RNF01 a RNF05, RNF07 |

## Etapa 1: Preparación

- [x] Crear el proyecto Next.js `sergio-decoraciones`
- [x] Crear el repositorio en GitHub y subir el primer commit
- [x] Copiar las variables de color y tipografía de IDENTIDAD-MARCA.md en `app/globals.css`
- [x] Cargar las tipografías Cinzel y Lato desde Google Fonts
- [x] Copiar los logos a `public/img/marca/`

## Etapa 2: Base de datos

- [x] Crear el proyecto en Neon y guardar `DATABASE_URL` en `.env.local`
- [x] Agregar `.env.local` al `.gitignore`
- [x] Escribir `lib/db.js` con la única conexión a la base
- [x] Ejecutar `db/esquema.sql` para crear las tablas `trabajos` y `consultas`
- [x] Cargar trabajos de muestra con sus fotos y texto alternativo

## Etapa 3: Estructura común y contacto

- [x] Crear `lib/contacto.js` con el número de WhatsApp y teléfono (marcador)
- [x] Armar `app/layout.js` con encabezado, menú y pie de página
- [x] Crear el componente `BotonWhatsApp` con el mensaje prellenado (RF05)
- [x] Crear el componente `BotonLlamar` (RF06)
- [x] Agregar el botón flotante de WhatsApp en todas las páginas
- [x] Hacer que el menú se vea como tres rayas en celular

## Etapa 4: Inicio y servicios

- [x] Maquetar la portada de inicio con título, subtítulo y botón "Ver trabajos"
- [x] Mostrar trabajos destacados en el inicio
- [x] Crear la página `/servicios` con los seis servicios (RF04)

## Etapa 5: Trabajos

- [ ] Crear la ruta `app/api/trabajos/route.js`
- [ ] Crear el componente `TarjetaTrabajo`
- [ ] Armar la página `/trabajos` con la galería (RF01)
- [ ] Crear `FiltroServicios` y filtrar por tipo de servicio (RF02)
- [ ] Crear `VisorFoto` para ver un trabajo en grande (RF03)

## Etapa 6: Nosotros y consulta

- [ ] Crear la página `/nosotros` (RF08)
- [ ] Crear el componente `FormularioConsulta` con nombre, teléfono y mensaje (RF07)
- [ ] Crear la ruta `app/api/consultas/route.js` que valida y guarda la consulta
- [ ] Mostrar un mensaje de confirmación al enviar el formulario
- [ ] Armar la página `/contacto` con WhatsApp, llamada y formulario

## Etapa 7: Panel privado de consultas

- [ ] Guardar `ADMIN_USUARIO`, `ADMIN_CLAVE_HASH` y `SESION_SECRETA` en `.env.local` y en Vercel
- [ ] Crear `lib/sesion.js` para crear y verificar la sesión
- [ ] Crear la ruta `app/api/admin/ingresar/route.js` con límite de intentos fallidos (RF09)
- [ ] Crear la página `/admin` con el componente `FormularioIngreso` (RF09)
- [ ] Crear la ruta `app/api/admin/consultas/route.js` protegida por sesión
- [ ] Crear la página `/admin/consultas` con `TablaConsultas`, las más recientes primero (RF10)
- [ ] Permitir marcar una consulta como atendida (RF11)
- [ ] Crear la ruta `app/api/admin/salir/route.js` y el botón "Salir"
- [ ] Verificar que sin sesión `/admin/consultas` y `/api/admin/consultas` no devuelven datos

## Etapa 8: Calidad y publicación

- [ ] Agregar título, descripción y texto alternativo en cada página (09-SEO.md)
- [ ] Revisar la lista de control de 10-SEGURIDAD.md
- [ ] Comprobar que `/admin` no aparece en el menú ni en los resultados de Google
- [ ] Probar el sitio en celular, tablet y computadora (RNF01)
- [ ] Medir la velocidad con PageSpeed Insights: menos de 3 segundos (RNF02)
- [ ] Revisar contraste y texto alternativo de las fotos (RNF03)
- [ ] Publicar en Vercel con HTTPS (RNF05)
- [ ] Verificar que los botones de WhatsApp y llamada funcionan en un celular real
