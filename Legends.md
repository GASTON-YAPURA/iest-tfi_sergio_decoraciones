# LEGENDS: leyendas y glosario de Sergio Decoraciones

Este archivo explica los códigos, símbolos y términos que se usan en el resto de los `.md` del proyecto. Si algo de otro archivo no se entiende, se busca acá.

## Archivos de la bitácora

| Archivo | Qué contiene |
|---|---|
| `IDENTIDAD-MARCA.md` | Nombre, logo, colores, tipografías, tono de voz y variables CSS |
| `01-CONTEXTO.md` | Por qué existe el sitio, para quién es y qué no incluye |
| `02-REQUERIMIENTOS.md` | Lo que tiene que hacer el sitio (RF y RNF) |
| `03-TECNOLOGIAS.md` | Stack elegido, tecnologías prohibidas y variables de entorno |
| `04-ARQUITECTURA.md` | Árbol de carpetas y función de cada parte |
| `05-DATOS.md` | Tablas de la base de datos y esquema SQL |
| `06-DISENO-UI.md` | Pantallas y aplicación de la identidad visual |
| `07-CONVENCIONES.md` | Nombres, formato del código, commits y ramas |
| `08-TAREAS.md` | Etapas de trabajo con casillas para tildar |
| `09-SEO.md` | Títulos, descripciones y palabras clave para Google |
| `10-SEGURIDAD.md` | Protección de datos, panel privado y lista de control |
| `AGENTS.md` | Reglas que la IA lee antes de escribir código |
| `Legends.md` | Este archivo: leyendas y glosario |
| `Memory.md` | Estado del proyecto y decisiones tomadas |
| `Commits.md` | Convención y registro de commits |

## Símbolos y marcas

| Símbolo | Significado | Dónde se usa |
|---|---|---|
| `[ ]` | Tarea pendiente | `08-TAREAS.md`, listas de control |
| `[x]` | Tarea terminada | `08-TAREAS.md`, listas de control |
| `RF01` a `RF11` | Requerimiento funcional: algo que el sitio hace | `02-REQUERIMIENTOS.md` |
| `RNF01` a `RNF07` | Requerimiento no funcional: una cualidad del sitio (velocidad, seguridad, etc.) | `02-REQUERIMIENTOS.md` |
| Alta / Media / Baja | Prioridad de un requerimiento | `02-REQUERIMIENTOS.md` |
| `+54 9 3837 000000` | Marcador del número de WhatsApp y teléfono; Sergio lo cambia por el real | `lib/contacto.js` |
| `$ 0` | Marcador de precio: los precios no se publican | `01-CONTEXTO.md`, `AGENTS.md` |
| `←` | Comentario sobre la función de un archivo en el árbol de carpetas | `04-ARQUITECTURA.md` |
| `` ` ` `` (comillas invertidas) | Nombre de archivo, carpeta, variable o código | Todos los archivos |

## Colores de la marca

| Nombre | HEX | Variable CSS | Uso |
|---|---|---|---|
| Blanco Puro | `#FFFFFF` | `--color-fondo` | Fondo dominante (60 %) |
| Negro Carbón | `#1A1A1A` | `--color-principal` | Títulos, textos y secciones oscuras (20 %) |
| Ocre Profundo | `#815922` | `--color-acento` | Botones, enlaces y detalles (10 %) |
| Gris Grafito | `#6C6D6F` | `--color-secundario` | Textos de apoyo, bordes e íconos (10 %) |
| Ocre suave | `rgba(129, 89, 34, 0.10)` | `--color-acento-suave` | Fondo suave de la portada; no es un color nuevo |

## Valores del campo `servicio`

| Valor en la base | Se muestra como |
|---|---|
| `interiores` | Trabajos de interiores (empapelado y alfombra) |
| `durlock` | Durlock, interior y exterior |
| `pintura` | Pintura en general, interior y exterior |
| `enduido` | Enduido, interior y exterior |
| `machimbre` | Colocación de machimbre |
| `molduras` | Colocación de molduras |

## Estados de una consulta

| Estado | Campo `atendida` | Cómo se ve en el panel |
|---|---|---|
| Pendiente | `FALSE` | Etiqueta en Ocre Profundo |
| Atendida | `TRUE` | Texto en Gris Grafito |

## Glosario

| Término | Significado en este proyecto |
|---|---|
| **Trabajos** | Los trabajos terminados de Sergio que se muestran en la galería. Se llaman "trabajos" en todo el proyecto: menú (TRABAJOS), dirección (`/trabajos`), código y base de datos |
| **Consulta** | Mensaje que una persona deja en el formulario de contacto: nombre, teléfono y mensaje |
| **Panel privado** | Sección `/admin` donde solo Sergio, con usuario y contraseña, ve las consultas |
| **Marcador** | Dato provisorio (como el teléfono o los precios) que se reemplaza cuando haya el dato real |
| **Stack** | Conjunto de tecnologías con las que se construye el sitio |
| **Frontend** | La parte que ve el visitante en su pantalla |
| **React** | Biblioteca para armar la interfaz con piezas reutilizables (componentes) |
| **Next.js** | Framework sobre React: organiza las páginas por carpetas, tiene rutas de API y ayuda con el SEO |
| **Componente** | Pieza de pantalla reutilizable, como `TarjetaTrabajo` o `BotonWhatsApp` |
| **Ruta de API** | Archivo `route.js` del servidor que lee o guarda datos en la base |
| **PostgreSQL** | Base de datos relacional donde se guardan `trabajos` y `consultas` |
| **Neon** | Servicio que aloja la base PostgreSQL (tiene plan gratuito) |
| **Esquema SQL** | Archivo `db/esquema.sql` que define las tablas |
| **Parámetro SQL** | Forma segura de pasar un valor a una consulta SQL, sin pegarlo dentro del texto, para evitar inyección SQL |
| **Variable de entorno** | Dato secreto o de configuración (como `DATABASE_URL`) guardado fuera del código, en `.env.local` y en Vercel |
| **Hash / bcrypt** | Forma de guardar la contraseña cifrada, de modo que nunca se vea en texto |
| **Sesión / cookie `httpOnly`** | Mecanismo que mantiene a Sergio dentro del panel; la cookie no puede leerse desde el navegador con código |
| **HTTPS** | Conexión segura entre el visitante y el sitio |
| **SEO** | Conjunto de prácticas para que el sitio aparezca en Google |
| **`noindex`** | Indicación para que Google no muestre una página (se usa en `/admin`) |
| **Texto alternativo (`alt`)** | Descripción escrita de una imagen, para accesibilidad y SEO |
| **Responsive** | Que el sitio se adapta al celular, la tablet y la computadora |
| **Mockup** | Boceto visual de una pantalla, usado como idea de diseño |
| **Git / GitHub** | Sistema de control de versiones y el servicio donde se guarda el repositorio |
| **Commit** | Registro de un cambio en el código (ver `Commits.md`) |
| **Rama (branch)** | Línea de trabajo paralela del repositorio: `main` y `feature/nombre` |
| **Vercel** | Servicio que publica el sitio en cada `git push` |
| **OpenCode** | Herramienta de IA que lee `AGENTS.md` y `docs/` para escribir el código |
| **PascalCase / camelCase** | Estilos de escribir nombres: `TarjetaTrabajo` y `listaTrabajos` |
| **PageSpeed Insights** | Herramienta de Google para medir la velocidad del sitio |
