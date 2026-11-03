# 06-DISENO-UI: cómo se ven las pantallas de Sergio Decoraciones

El diseño sigue el mockup de la página de inicio: encabezado blanco con el logo, menú en mayúsculas, botón de contacto en ocre y una portada con título grande sobre un fondo suave. Todos los colores y tipografías salen de IDENTIDAD-MARCA.md y se usan siempre a través de sus variables CSS.

## Pantallas

| Ruta | Pantalla | Contenido | Requerimientos |
|---|---|---|---|
| `/` | Inicio | Portada con título y botón "Ver trabajos", trabajos destacados y resumen de servicios | RF01, RF04, RF05 |
| `/servicios` | Servicios | Los seis servicios de Sergio con su detalle y las fichas personalizadas que se creen desde el panel | RF04, RF22 |
| `/trabajos` | Trabajos | Galería de trabajos terminados, filtro por servicio y foto en grande | RF01, RF02, RF03 |
| `/nosotros` | Nosotros | Quién es Sergio y cómo trabaja | RF08 |
| `/contacto` | Contacto | Botón de WhatsApp, botón de llamada y formulario de consulta | RF05, RF06, RF07 |
| `/admin` | Ingreso (privado) | Usuario y contraseña de Sergio | RF09 |
| `/admin/consultas` | Consultas (privado) | Listado de las consultas recibidas | RF10, RF11 |
| `/admin/trabajos` | Trabajos (privado) | Alta, edición y administración de trabajos | RF19, RF20, RF23 |
| `/admin/servicios` | Servicios (privado) | Listado de servicios y alta de fichas descriptivas | RF21, RF22, RF23 |

## Estructura común (`app/layout.js`)

- **Encabezado:** fondo blanco. A la izquierda va el logo: versión horizontal en computadora y monograma SD en celular. En el centro y a la derecha, el menú: INICIO, SERVICIOS, TRABAJOS, NOSOTROS y el botón CONTACTO. Con la sesión de Sergio iniciada, aparece también el enlace PANEL ADMIN junto a CONTACTO; al salir, deja de aparecer.
- **Menú:** letras mayúsculas con espacio entre letras, en Negro Carbón. La página activa va en Ocre Profundo con un subrayado del mismo color. En celular se convierte en menú de tres rayas.
- **Pie de página:** fondo Negro Carbón, logo horizontal blanco y los datos de contacto en blanco.
- **Botón flotante de WhatsApp:** circular, abajo a la derecha, fijo mientras se navega. Fondo Ocre Profundo e ícono blanco.

## Portada de inicio

- **Título (H1):** "Decoraciones que transforman tus espacios"
- **Subtítulo:** "Pintura, durlock, empapelado y más, con detalle y buen oficio."
- **Botón:** "Ver trabajos"
- **Fondo:** degradé suave de blanco a `--color-acento-suave`, con dos círculos decorativos grandes en ese mismo tono a la derecha.

## Cómo se aplica la identidad

| Elemento | Estilo | Variables |
|---|---|---|
| Título principal (H1, H2) | Cinzel Bold, Negro Carbón | `--fuente-titulos`, `--color-principal` |
| Texto y subtítulos | Lato Regular, Gris Grafito para apoyo | `--fuente-texto`, `--color-secundario` |
| Botón principal | Fondo Ocre Profundo, texto blanco en mayúsculas, esquinas de 4 px | `--color-acento`, `--color-fondo`, `--radio-borde` |
| Botón secundario | Borde y texto en Ocre Profundo, fondo transparente | `--color-acento` |
| Tarjeta de trabajo | Fondo blanco, borde fino gris, foto arriba, título en Cinzel y etiqueta del servicio en ocre | `--color-fondo`, `--color-secundario`, `--color-acento` |
| Formulario | Campos con borde gris que pasa a ocre al enfocar; botón de envío principal | `--color-secundario`, `--color-acento` |
| Fondo suave | Degradé y círculos decorativos de la portada | `--color-acento-suave` |
| Secciones oscuras y pie | Fondo Negro Carbón, logo y textos en blanco | `--color-principal`, `--color-fondo` |

### Reglas de color

- Fondo dominante blanco; Negro Carbón para títulos y textos; Ocre Profundo solo para acentos y botones; Gris Grafito para textos de apoyo.
- El texto sobre Ocre Profundo siempre es blanco.
- Los mensajes de confirmación y de error del formulario van en Negro Carbón con borde ocre y un ícono. No se agregan colores nuevos.

## Panel privado de Sergio

El enlace `/admin` no aparece para visitantes sin sesión ni en el pie de página. Con la sesión de Sergio iniciada, el menú público muestra «Panel admin» junto a «Contacto» para volver al panel después de revisar el sitio. Desde el menú común del panel se puede abrir «Trabajos» para comprobar los cambios en la página pública sin cerrar la sesión.

- **Ingreso:** tarjeta centrada sobre fondo blanco, con el monograma SD arriba, los campos de usuario y contraseña y el botón principal "Ingresar". El campo de contraseña tiene un botón accesible para mostrar u ocultar lo escrito. Si los datos no son correctos se muestra el mensaje "Usuario o contraseña incorrectos".
- **Encabezado del panel:** título "Consultas recibidas", una bajada corta y el botón secundario "Salir" a la derecha. En celular se apila.
- **Resumen:** tres tarjetas chicas con las consultas **pendientes**, las **atendidas** y el **total**. Los números van en Cinzel; las pendientes se destacan en Ocre Profundo.
- **Barra de herramientas:** buscador por nombre o teléfono, filtros tipo pastilla (Todas, Pendientes, Atendidas, Archivadas) y botón "Exportar PDF". En celular el buscador ocupa el ancho completo.
- **Listado:** en computadora, una tabla con fecha, nombre, teléfono, mensaje, estado y acciones; en celular, una tarjeta por consulta. Se ven de a 10, con "Anterior" y "Siguiente".
- **Estado:** las consultas pendientes llevan una etiqueta en Ocre Profundo; las atendidas en Gris Grafito; las archivadas en gris claro.
- **Acciones de cada consulta:** "Responder" abre un cuadro con el mensaje ya escrito (se puede editar) y después WhatsApp; "Marcar como atendida"; "Archivar". Las archivadas muestran "Restaurar" y "Borrar".
- Usa los mismos colores, tipografías y botones que el resto del sitio. No se agregan colores nuevos.

### Panel de trabajos (`/admin/trabajos`)

- **Listado:** una fila por trabajo con miniatura de la primera foto, título, servicio, cantidad de fotos y estado (visible u oculto). Botones "Editar", "Ocultar/Mostrar" y "Borrar".
- **Formulario:** campos de título, servicio (lista de los seis servicios principales y los personalizados ya creados), descripción y visible. El formulario no crea servicios. Las fotos se agregan con un selector que acepta varias a la vez; cada una muestra su vista previa, su texto alternativo y botones para subir, bajar o quitar.

### Panel de servicios (`/admin/servicios`)

- Sección separada para consultar servicios y agregar una ficha personalizada con nombre, detalle breve y descripción.
- El listado de servicios personalizados muestra su estado (visible u oculto) y acciones "Ocultar/Mostrar" y "Borrar". Los seis servicios fijos no tienen acciones administrativas.
- Ocultar quita la ficha de `/servicios`, pero la conserva en el panel y como categoría seleccionable en Trabajos.
- Borrar pide confirmación; si el servicio está asignado a uno o más trabajos, se informa que primero hay que reasignarlos.
- Crear un servicio no crea un trabajo. Los servicios personalizados quedan disponibles como categorías opcionales en el formulario de trabajos.
- La navegación del panel presenta Consultas, Trabajos y Servicios, con la sección actual marcada.
- **Foto principal:** es la primera de la lista. Se avisa con una etiqueta "Portada".
- **Borrar:** pide confirmación y avisa que también se borran las fotos.
- **Vuelta al panel:** enlace "Consultas" para cambiar de sección sin escribir la dirección.
- Todo se guarda en la base de datos: no se sube ni se edita ningún archivo del código.

### Página de servicios (`/servicios`)

- Se conservan las seis fichas actuales sin cambios.
- Después de ellas se muestran las fichas adicionales guardadas, con nombre, detalle y descripción.
- No se muestran las fichas adicionales ocultas.
- Los servicios adicionales antiguos que no tengan detalle o descripción muestran solo los datos disponibles; no se inventa contenido.

## Pantalla de trabajos

- La galería se ve en 3 columnas en computadora, 2 en tablet y 1 en celular.
- Arriba hay botones para filtrar: Todos, Interiores, Durlock, Pintura, Enduido, Machimbre y Molduras.
- Al tocar una tarjeta, la foto se abre en grande con su descripción. Si el trabajo tiene varias fotos, el visor muestra flechas y un contador ("2 de 4").

## Botones de contacto

| Botón | Qué hace |
|---|---|
| WhatsApp | Abre la conversación con el mensaje: "Hola Sergio, vi su sitio web y quiero consultar por un trabajo de decoración." |
| Llamar | Marca el número de Sergio desde el celular |

El número se toma siempre de `lib/contacto.js`.

## Ejemplo en código

```css
/* app/globals.css */
.boton-principal {
  background: var(--color-acento);
  color: var(--color-fondo);
  font-family: var(--fuente-texto);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: var(--radio-borde);
}

.portada {
  background: linear-gradient(var(--color-fondo), var(--color-acento-suave));
}
```
