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

### Contacto (RF05, RF06, RF07)

- El botón de WhatsApp abre la conversación con un mensaje ya escrito
- El botón de llamada marca el número de Sergio desde el celular
- El formulario de consulta pide nombre, teléfono y mensaje, y confirma el envío
- Los botones de contacto están visibles en todas las páginas

### Panel de administración (RF09, RF10, RF11)

*Como Sergio, quiero entrar con mi contraseña a un panel para ver las consultas que me hicieron desde el sitio.*

- El enlace `/admin` muestra solo el ingreso; sin usuario y contraseña correctos no se ve ninguna consulta
- Con el ingreso correcto se abre el listado, con la consulta más reciente arriba
- Cada consulta muestra fecha, nombre, teléfono, mensaje y si está pendiente o atendida
- Se puede marcar una consulta como atendida
- El botón Salir cierra la sesión
- El enlace al panel no aparece en el menú del sitio
