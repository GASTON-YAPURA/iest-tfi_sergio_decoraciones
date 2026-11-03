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

- [x] Crear la ruta `app/api/trabajos/route.js`
- [x] Crear el componente `TarjetaTrabajo`
- [x] Armar la página `/trabajos` con la galería (RF01)
- [x] Crear `FiltroServicios` y filtrar por tipo de servicio (RF02)
- [x] Crear `VisorFoto` para ver un trabajo en grande (RF03)

## Etapa 6: Nosotros y consulta

- [x] Crear la página `/nosotros` (RF08)
- [x] Crear el componente `FormularioConsulta` con nombre, teléfono y mensaje (RF07)
- [x] Crear la ruta `app/api/consultas/route.js` que valida y guarda la consulta
- [x] Mostrar un mensaje de confirmación al enviar el formulario
- [x] Armar la página `/contacto` con WhatsApp, llamada y formulario

## Etapa 7: Panel privado de consultas

- [x] Guardar `ADMIN_USUARIO`, `ADMIN_CLAVE_HASH` y `SESION_SECRETA` en `.env.local`
- [x] Crear `lib/sesion.js` para crear y verificar la sesión
- [x] Crear la ruta `app/api/admin/ingresar/route.js` con límite de intentos fallidos (RF09)
- [x] Crear la página `/admin` con el componente `FormularioIngreso` (RF09)
- [x] Crear la ruta `app/api/admin/consultas/route.js` protegida por sesión
- [x] Crear la página `/admin/consultas` con `TablaConsultas`, las más recientes primero (RF10)
- [x] Permitir marcar una consulta como atendida (RF11)
- [x] Crear la ruta `app/api/admin/salir/route.js` y el botón "Salir"
- [x] Verificar que sin sesión `/admin/consultas` y `/api/admin/consultas` no devuelven datos

## Etapa 8: Calidad y publicación

> Para probar en el celular con `npm run dev`, la IP de la computadora va en `ORIGENES_DESARROLLO` dentro de `.env.local` y el servidor se reinicia; si no, Next bloquea los archivos de desarrollo y los botones no responden.

- [x] Cargar `DATABASE_URL`, `ADMIN_USUARIO`, `ADMIN_CLAVE_HASH`, `SESION_SECRETA` y `SITIO_URL` en Vercel
- [x] Agregar título, descripción y texto alternativo en cada página (09-SEO.md)
- [x] Revisar la lista de control de 10-SEGURIDAD.md
- [x] Crear `docs/DECLARACION-IA.md` y `multimedia/FICHAS-IA.md`, y poner la leyenda "Generado con IA" en las fotos de muestra (principio 8)
- [x] Comprobar que `/admin` no aparece en el menú sin sesión ni en los resultados de Google
- [x] Probar el sitio en celular, tablet y computadora (RNF01)
- [x] Medir la velocidad con PageSpeed Insights: menos de 3 segundos (RNF02)
- [x] Revisar contraste y texto alternativo de las fotos (RNF03)
- [x] Publicar en Vercel con HTTPS (RNF05)
- [x] Verificar que los botones de WhatsApp y llamada funcionan en un celular real

## Etapa 9: Panel de administración completo

> Los cambios de esta etapa se hacen con la base ya conectada. Cada punto se prueba con `npm test` y `npm run build` antes del commit.

### Base de datos

- [x] Agregar a `db/esquema.sql` la tabla `trabajo_fotos` y la columna `archivada` de `consultas`
- [x] Sacar de `trabajos` la columna `foto` y el `texto_alt`, que ahora viven en `trabajo_fotos`
- [x] Crear `scripts/importar-fotos.mjs` y el comando `npm run db:fotos`
- [x] Importar las seis fotos actuales a la base y vaciar `public/img/trabajos/`

### Consultas

- [x] Buscar consultas por nombre o teléfono (RF12)
- [x] Filtrar por pendientes, atendidas y archivadas (RF13)
- [x] Mostrar las consultas de a 10, con anterior y siguiente (RF14)
- [x] Escribir el mensaje antes de responder por WhatsApp (RF15)
- [x] Archivar, restaurar y borrar consultas con confirmación (RF16)
- [x] Exportar las consultas filtradas a PDF (RF17)
- [x] Mostrar el resumen de pendientes, atendidas y total (RF18)
- [x] Revisar el orden visual del panel con la paleta de marca

### Acceso

- [x] Permitir mostrar u ocultar la contraseña en el ingreso al panel (RF09)

### Trabajos

- [x] Crear la página `/admin/trabajos` protegida por sesión (RF19)
- [x] Crear la ruta `app/api/admin/trabajos/route.js` para alta, edición y borrado (RF19)
- [x] Crear la ruta `app/api/admin/trabajos/[id]/fotos/route.js` para las fotos (RF20)
- [x] Crear la ruta `app/api/trabajos/[id]/foto/route.js` que entrega la foto desde la base
- [x] Permitir varias fotos por trabajo, con texto alternativo y orden (RF20)
- [x] Comprimir la foto en el navegador antes de subirla y validarla en el servidor
- [x] Ocultar y volver a mostrar un trabajo sin borrarlo (RF19)
- [x] Pedir confirmación antes de borrar un trabajo y sus fotos (RF19)
- [x] Hacer que la galería y el inicio lean las fotos desde la base
- [x] Mostrar todas las fotos de un trabajo en el visor, con flechas y contador
- [x] Agregar pruebas de permisos, validaciones y del panel de trabajos
- [x] Reemplazar las fotos de muestra por las definitivas y actualizar las fichas de IA
- [x] Actualizar `memory.md`, `Commits.md` y `11 - RECORRIDO DEL PROYECTO.md`

## Etapa 10: Servicios adicionales para trabajos

> Los servicios adicionales se pueden crear desde el formulario de un trabajo. Se guardan para reutilizarlos y aparecen como etiqueta/filtro en Trabajos; la página `/servicios` conserva sus seis servicios definidos.

- [x] Actualizar la especificación de servicios adicionales en `01`, `02`, `04`, `05`, `06` y `10`
- [x] Crear la tabla idempotente para servicios adicionales y su validación única sin distinguir mayúsculas
- [x] Crear la API protegida para listar y agregar servicios adicionales
- [x] Permitir agregar un servicio desde el formulario de alta de trabajo y reutilizarlo después
- [x] Mostrar los nombres y filtros de los servicios adicionales en el panel y la galería pública
- [x] Agregar pruebas para validación, permisos, duplicados, formulario y filtros
- [x] Ejecutar `npm test` y `npm run build`
- [x] Actualizar `memory.md` y `11 - RECORRIDO DEL PROYECTO.md`

## Etapa 11: Fichas de servicios adicionales

> Al crear un servicio desde el alta de un trabajo, Sergio completa nombre, detalle y descripción. La ficha nueva se reutiliza en Trabajos y se muestra también en `/servicios`, conservando las seis fichas originales.

- [x] Actualizar requisitos, datos, arquitectura, diseño y seguridad
- [x] Ampliar el esquema idempotente para guardar detalle y descripción, conservando servicios existentes
- [x] Validar y guardar nombre, detalle y descripción desde la API protegida
- [x] Agregar los campos al formulario de alta de servicio
- [x] Mostrar las fichas adicionales en `/servicios` y reflejar el alta sin esperar la caché
- [x] Agregar pruebas para campos, persistencia, permisos y ficha pública
- [x] Ejecutar `npm test` y `npm run build`
- [x] Actualizar `memory.md` y `11 - RECORRIDO DEL PROYECTO.md`
