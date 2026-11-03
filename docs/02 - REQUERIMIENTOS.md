# 02-REQUERIMIENTOS: qué tiene que hacer el sitio de Sergio Decoraciones

## Requerimientos funcionales

| ID | Requerimiento funcional | Prioridad |
|---|---|---|
| RF01 | Galería de trabajos terminados con fotos | Alta |
| RF02 | Filtrar la galería por tipo de servicio | Media |
| RF03 | Ver un trabajo en grande | Media |
| RF04 | Página de servicios | Alta |
| RF05 | Botón de WhatsApp con mensaje prellenado | Alta |
| RF06 | Botón para llamar por teléfono | Alta |
| RF07 | Formulario de consulta | Baja |
| RF08 | Página Nosotros: quién es Sergio y cómo trabaja | Media |
| RF09 | Acceso de Sergio al panel con usuario y contraseña, desde un enlace privado | Alta |
| RF10 | Ver el listado de consultas recibidas, las más recientes primero | Alta |
| RF11 | Marcar una consulta como atendida | Media |
| RF12 | Buscar consultas por nombre o teléfono | Media |
| RF13 | Filtrar las consultas por estado (pendientes, atendidas, archivadas) | Media |
| RF14 | Ver las consultas de a 10 por página | Baja |
| RF15 | Escribir el mensaje antes de responder por WhatsApp | Media |
| RF16 | Archivar, restaurar y borrar consultas | Media |
| RF17 | Exportar las consultas a un archivo PDF | Baja |
| RF18 | Ver cuántas consultas quedan pendientes | Baja |
| RF19 | Administrar los trabajos desde el panel: agregar, editar, ocultar y borrar | Alta |
| RF20 | Cargar varias fotos por trabajo, guardadas en la base de datos | Alta |
| RF21 | Agregar desde el panel servicios personalizados reutilizables para clasificar trabajos | Media |
| RF22 | Mostrar cada servicio personalizado en la página Servicios con su nombre, detalle y descripción | Media |

## Requerimientos no funcionales

| ID | Requerimiento no funcional | Cómo se cumple |
|---|---|---|
| RNF01 | Responsive: se ve bien en celular, tablet y computadora | Diseño pensado primero para celular |
| RNF02 | Carga rápida: menos de 3 segundos en conexión móvil | Fotos livianas y optimizadas |
| RNF03 | Accesible: textos legibles y fotos con texto alternativo | Contraste de la paleta y atributo `alt` en cada imagen |
| RNF04 | Contenido en español | Textos con el tono de voz de IDENTIDAD-MARCA.md |
| RNF05 | Conexión segura | Publicación con HTTPS |
| RNF06 | Fiel a la marca | Colores, tipografías y logo definidos en IDENTIDAD-MARCA.md |
| RNF07 | Privado: solo Sergio puede ver las consultas | Usuario y contraseña, sesión protegida y enlace fuera del menú |

## Historia de usuario

*Como cliente que necesita un trabajo de decoración, quiero ver trabajos ya terminados y escribirle a Sergio por WhatsApp para consultarle sin tener que buscar su número.*

## Criterios de aceptación

### Galería de trabajos (RF01, RF02, RF03)

- Cada trabajo se muestra con foto y nombre del servicio
- Al elegir un tipo de servicio, solo se ven los trabajos de ese tipo
- Al tocar una foto, se abre en tamaño grande
- Si un trabajo tiene varias fotos, el visor permite pasarlas con flechas

### Contacto (RF05, RF06, RF07)

- El botón de WhatsApp abre la conversación con un mensaje ya escrito
- El botón de llamada marca el número de Sergio desde el celular
- El formulario de consulta pide nombre, teléfono y mensaje, y confirma el envío
- Los botones de contacto están visibles en todas las páginas

### Panel de consultas (RF09 a RF18)

*Como Sergio, quiero entrar con mi contraseña a un panel para ver y organizar las consultas que me hicieron desde el sitio.*

- El enlace `/admin` muestra solo el ingreso; sin usuario y contraseña correctos no se ve ninguna consulta
- Con el ingreso correcto se abre el listado, con la consulta más reciente arriba
- Cada consulta muestra fecha, nombre, teléfono, mensaje y si está pendiente o atendida
- Se puede marcar una consulta como atendida
- Se puede buscar por nombre o teléfono y filtrar por estado
- El listado se ve de a 10 consultas por página
- Antes de responder por WhatsApp se puede escribir el mensaje
- Las consultas se pueden archivar, restaurar y borrar; las archivadas no se mezclan con las pendientes
- Se pueden descargar las consultas en un PDF
- Arriba se ve cuántas consultas quedan pendientes
- El botón Salir cierra la sesión
- Sin sesión, el enlace al panel no aparece en el menú del sitio
- Con sesión iniciada, el menú muestra «Panel admin» junto a «Contacto» para volver al panel después de revisar los cambios en la página pública

### Panel de trabajos (RF19, RF20)

*Como Sergio, quiero cargar y corregir mis trabajos sin depender de nadie.*

- Solo con sesión iniciada se puede ver `/admin/trabajos`
- Se puede agregar un trabajo con título, servicio, descripción, visibilidad y una o varias fotos
- Cada foto pide su texto alternativo y se comprime antes de subirse
- Se puede editar un trabajo existente y agregarle fotos nuevas
- Se puede quitar una foto y cambiar el orden de las fotos
- Se puede ocultar un trabajo sin borrarlo y volver a mostrarlo después
- Al borrar un trabajo se borran también sus fotos, con confirmación previa
- Los cambios se ven en el sitio sin tocar código: las fotos salen de la base de datos
- Al guardar, agregar u ocultar un trabajo, los cambios aparecen de inmediato en el inicio y en la galería pública
- Si la base falla, el panel muestra un mensaje claro y no pierde lo que estaba cargado
- Al agregar un trabajo se puede elegir un servicio existente o crear uno nuevo
- El servicio nuevo se guarda para reutilizarlo en trabajos futuros y aparece como etiqueta y filtro en la galería pública
- Al crear un servicio personalizado se ingresan nombre, detalle y descripción
- El servicio personalizado aparece como ficha en `/servicios` y sus cambios se ven inmediatamente
- Las seis fichas fijas actuales de `/servicios` se conservan sin cambios
- El nombre del servicio se valida y no se permiten duplicados sin distinguir mayúsculas y minúsculas
- El nombre, detalle y descripción se validan en el servidor
