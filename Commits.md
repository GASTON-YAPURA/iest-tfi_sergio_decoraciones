# COMMITS: convención y registro de Sergio Decoraciones

Este archivo tiene dos partes: la regla para escribir los commits (definida en `07-CONVENCIONES.md`) y el registro de los commits importantes del proyecto.

## Convención

Cada commit:

- empieza con un **verbo en presente**
- va en **minúsculas**
- **no lleva punto final**
- describe **un solo cambio**
- está escrito en **español**

### Ejemplos correctos

```text
agrega filtro por servicio en trabajos
corrige el texto alternativo de las fotos
actualiza los colores en globals.css
crea la ruta de api para guardar consultas
```

### Ejemplos incorrectos

| Mensaje | Problema |
|---|---|
| `Agregué cosas` | Pasado, mayúscula y no dice qué cambió |
| `arreglos varios.` | Vago y con punto final |
| `agrega galería y formulario y panel` | Mezcla varios cambios en uno |
| `fix filter` | Está en inglés y no dice dónde |

## Ramas

| Rama | Uso |
|---|---|
| `main` | Versión publicada en Vercel |
| `feature/nombre` | Una funcionalidad nueva, por ejemplo `feature/trabajos` |

Cada rama `feature/` se prueba en la vista previa que genera Vercel antes de pasar a `main`.

## Flujo de trabajo

1. Crear la rama de la funcionalidad: `git checkout -b feature/nombre`
2. Hacer la tarea de `08-TAREAS.md` y marcarla con `[x]`
3. Guardar el cambio con un commit que siga la convención
4. Subir la rama con `git push` y probar la vista previa de Vercel
5. Pasar a `main` y registrar el cambio importante en la tabla de abajo

Se recomienda un commit por cada tarea tildada en `08-TAREAS.md`.

## Registro de commits

Se anotan los commits importantes. Para ver el historial completo se usa `git log --oneline`.

| Fecha | Etapa | Rama | Mensaje del commit | Qué cambió |
|---|---|---|---|---|
| 24/10/2026 | 1. Preparación | `main` | `crea el proyecto next.js con la identidad de marca` | Proyecto Next.js, variables de marca, tipografías y logos |
| 24/10/2026 | 1. Preparación | `main` | `actualiza el estado de la etapa 1` | Estado del proyecto y registro de commits |
| 25/10/2026 | 2. Base de datos | `main` | `crea las tablas y carga los trabajos de muestra` | Neon, `lib/db.js`, esquema, datos y fotos de muestra |
| 25/10/2026 | 3. Estructura común y contacto | `main` | `agrega la estructura comun y los botones de contacto` | Encabezado, menú responsive, pie, WhatsApp, llamada y pruebas |
| 27/10/2026 | 4. Inicio y servicios | `main` | `maqueta el inicio y la pagina de servicios` | Portada, trabajos destacados, resumen y página de servicios |
| 27/10/2026 | 5. Trabajos | `main` | `agrega la galeria de trabajos con filtro y visor` | API, galería, filtro por servicio, visor y pruebas |
| 28/10/2026 | 6. Nosotros y consulta | `main` | `valida y guarda las consultas del formulario` | Página Nosotros, Contacto, formulario, API, validación, límite y pruebas |
| 28/10/2026 | 7. Panel privado de consultas | `main` | `protege el panel de consultas con sesion` | Ingreso, sesión firmada, límite de intentos, listado protegido, marcar atendida, salir y pruebas |
| 28/10/2026 | 8. Calidad y publicación | `main` | `arregla el menu hamburguesa en el celular` | Origen de desarrollo permitido, cierre con Escape, al tocar fuera y al cambiar de ruta, scroll del fondo bloqueado, cruz animada y pruebas |
| 31/10/2026 | 8. Calidad y publicación | `main` | `completa la etapa de calidad y publicación` | SEO, seguridad, declaración de IA y actualización de las especificaciones del proyecto |
| 01/11/2026 | 9. Panel de administración | `main` | `documenta el panel de administracion de trabajos` | RF12 a RF20, tablas `trabajo_fotos` y `archivada`, pantallas del panel, seguridad y tareas de la etapa 9 |
| 01/11/2026 | 9. Panel de administración | `main` | `guarda las fotos de los trabajos en la base` | Tabla `trabajo_fotos`, importación con `npm run db:fotos`, ruta de fotos, visor con varias fotos, fotos definitivas y fichas de IA |
| 02/11/2026 | 9. Panel de administración | `main` | `agrega busqueda filtros y archivo de consultas` | Buscador, filtros, paginado, resumen, archivar/restaurar, borrado definitivo, respuesta editable y CSV |
| 02/11/2026 | 9. Panel de administración | `main` | `feaa793 agrega el panel de trabajos con fotos` | Página y API de trabajos, fotos en la base, compresión en el navegador, texto alternativo, orden, visibilidad y borrado con confirmación |
| 02/11/2026 | 9. Panel de administración | `main` | `ba51588 documenta el panel de trabajos` | Documentación y memoria del panel de trabajos |
| 02/11/2026 | 9. Panel de administración | `main` | `cambia la exportación de consultas a pdf` | La descarga de consultas pasó de CSV a PDF con `pdf-lib`: tabla A4, cabecera de marca, acentos, paginado y filtros |
| 02/11/2026 | 9. Panel de administración | `main` | `documenta la exportación de consultas en pdf` | Especificaciones, recorrido, memoria y registro actualizados |
| 03/11/2026 | 9. Panel de administración | `feature/mostrar-clave` | `agrega opcion para mostrar la contrasena en el ingreso` | Control accesible para mostrar u ocultar la contraseña en el formulario de ingreso |

Repositorio: https://github.com/GASTON-YAPURA/iest-tfi_sergio_decoraciones

### Mensajes sugeridos por etapa

Ejemplos de cómo quedarían los commits de cada etapa de `08-TAREAS.md`:

| Etapa | Ejemplo de commit |
|---|---|
| 1. Preparación | `agrega las variables de la marca en globals.css` |
| 2. Base de datos | `crea las tablas trabajos y consultas` |
| 3. Estructura común y contacto | `agrega el boton flotante de whatsapp` |
| 4. Inicio y servicios | `maqueta la portada de inicio` |
| 5. Trabajos | `agrega filtro por servicio en trabajos` |
| 6. Nosotros y consulta | `valida el formulario de consulta en la api` |
| 7. Panel privado | `protege las consultas del panel con sesion` |
| 8. Calidad y publicación | `agrega noindex a las paginas de admin` |

## Qué nunca va en un commit

- El archivo `.env.local` ni ninguna variable secreta (`DATABASE_URL`, `ADMIN_CLAVE_HASH`, `SESION_SECRETA`)
- La carpeta `node_modules/`
- Contraseñas, claves o datos de consultas reales
