# 04-ARQUITECTURA: cómo se organiza el código de Sergio Decoraciones

## Árbol de carpetas

```text
sergio-decoraciones/
├── AGENTS.md                      ← reglas para la IA
├── docs/                          ← especificaciones (.md)
├── app/
│   ├── layout.js                  ← encabezado, pie y botones de contacto
│   ├── page.js                    ← inicio
│   ├── globals.css                ← variables de la marca
│   ├── trabajos/page.js           ← galería de trabajos con filtro
│   ├── servicios/page.js          ← lista de servicios
│   ├── nosotros/page.js           ← quién es Sergio y cómo trabaja
│   ├── contacto/page.js           ← WhatsApp, llamada y formulario
│   ├── admin/
│   │   ├── page.js                ← ingreso de Sergio
│   │   └── consultas/page.js      ← listado de consultas (privado)
│   └── api/
│       ├── trabajos/route.js      ← devuelve los trabajos
│       ├── consultas/route.js     ← guarda una consulta
│       └── admin/
│           ├── ingresar/route.js  ← valida usuario y contraseña
│           ├── consultas/route.js ← lista las consultas y marca atendidas
│           └── salir/route.js     ← cierra la sesión
├── components/
│   ├── TarjetaTrabajo.js          ← foto y título de un trabajo
│   ├── FiltroServicios.js         ← botones para filtrar por servicio
│   ├── VisorFoto.js               ← foto en tamaño grande
│   ├── BotonWhatsApp.js           ← abre WhatsApp con mensaje escrito
│   ├── BotonLlamar.js             ← llama por teléfono
│   ├── MenuPrincipal.js           ← menú de navegación y versión de tres rayas
│   ├── FormularioConsulta.js      ← formulario de consulta
│   ├── FormularioIngreso.js       ← usuario y contraseña del panel
│   └── TablaConsultas.js          ← listado de consultas del panel
├── lib/
│   ├── db.js                      ← única conexión a la base
│   ├── contacto.js                ← número de WhatsApp y teléfono
│   └── sesion.js                  ← crea y verifica la sesión de Sergio
├── db/
│   ├── esquema.sql                ← tablas de la base de datos
│   ├── datos.sql                  ← trabajos de muestra
│   └── ejecutar-sql.js            ← ejecuta un archivo SQL con lib/db.js
├── test/
│   ├── estructura.test.js         ← variables, idioma y portada
│   ├── base-datos.test.js         ← esquema, datos y conexión
│   └── contacto.test.js           ← enlaces de WhatsApp y llamada
├── public/
│   └── img/
│       ├── marca/                 ← logos
│       └── trabajos/              ← fotos de trabajos terminados
└── .env.local                     ← variables secretas, no se sube a GitHub
```

## Función de cada parte

| Parte | Función |
|---|---|
| `app/` | Páginas del sitio: cada carpeta con `page.js` es una dirección (`/trabajos`, `/servicios`, `/nosotros`, `/contacto`) |
| `app/layout.js` | Estructura común de todas las páginas: encabezado con el logo, pie y botones de contacto |
| `app/api/` | Rutas del servidor que leen y escriben en la base de datos |
| `components/` | Piezas de pantalla reutilizables |
| `components/MenuPrincipal.js` | Menú de navegación con la página activa y el botón de tres rayas en celular |
| `lib/db.js` | Único lugar donde se conecta con la base de datos |
| `lib/contacto.js` | Único lugar donde se escribe el número de contacto (marcador `+54 9 3837 000000`) |
| `app/admin/` | Panel privado de Sergio: ingreso y listado de consultas |
| `lib/sesion.js` | Único lugar donde se crea y se verifica la sesión del panel |
| `db/esquema.sql` | Definición de las tablas (ver 05-DATOS.md) |
| `db/datos.sql` | Trabajos de muestra para la galería |
| `db/ejecutar-sql.js` | Ejecuta `esquema.sql` o `datos.sql` usando la conexión de `lib/db.js` |
| `test/` | Pruebas automáticas con `node:test` |
| `public/img/` | Imágenes que el navegador puede pedir directamente |
| `.env.local` | Variables secretas; está en `.gitignore` y nunca se sube |

## Reglas de la arquitectura

- Toda consulta a la base pasa por `lib/db.js`.
- El número de contacto se lee siempre de `lib/contacto.js`, nunca se escribe a mano en un componente.
- Cada componente hace una sola cosa y vive en su propio archivo.
- En el menú, en las direcciones, en el código y en la base de datos se usa siempre la palabra "trabajos" (nunca "proyectos").
- Toda página y ruta de `admin/` verifica la sesión con `lib/sesion.js` antes de mostrar o devolver datos.
