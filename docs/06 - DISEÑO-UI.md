# 06-DISENO-UI: cómo se ven las pantallas de Sergio Decoraciones

El diseño sigue el mockup de la página de inicio: encabezado blanco con el logo, menú en mayúsculas, botón de contacto en ocre y una portada con título grande sobre un fondo suave. Todos los colores y tipografías salen de IDENTIDAD-MARCA.md y se usan siempre a través de sus variables CSS.

## Pantallas

| Ruta | Pantalla | Contenido | Requerimientos |
|---|---|---|---|
| `/` | Inicio | Portada con título y botón "Ver trabajos", trabajos destacados y resumen de servicios | RF01, RF04, RF05 |
| `/servicios` | Servicios | Los seis servicios de Sergio con su detalle | RF04 |
| `/trabajos` | Trabajos | Galería de trabajos terminados, filtro por servicio y foto en grande | RF01, RF02, RF03 |
| `/nosotros` | Nosotros | Quién es Sergio y cómo trabaja | RF08 |
| `/contacto` | Contacto | Botón de WhatsApp, botón de llamada y formulario de consulta | RF05, RF06, RF07 |
| `/admin` | Ingreso (privado) | Usuario y contraseña de Sergio | RF09 |
| `/admin/consultas` | Consultas (privado) | Listado de las consultas recibidas | RF10, RF11 |

## Estructura común (`app/layout.js`)

- **Encabezado:** fondo blanco. A la izquierda va el logo: versión horizontal en computadora y monograma SD en celular. En el centro y a la derecha, el menú: INICIO, SERVICIOS, TRABAJOS, NOSOTROS y el botón CONTACTO.
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

El enlace `/admin` no aparece en el menú ni en el pie de página. Sergio entra escribiendo la dirección o desde un favorito de su navegador.

- **Ingreso:** tarjeta centrada sobre fondo blanco, con el monograma SD arriba, los campos de usuario y contraseña y el botón principal "Ingresar". Si los datos no son correctos se muestra el mensaje "Usuario o contraseña incorrectos".
- **Consultas:** en computadora, una tabla con fecha, nombre, teléfono, mensaje y estado; en celular, una tarjeta por consulta. Arriba a la derecha va el botón secundario "Salir".
- **Estado:** las consultas pendientes llevan una etiqueta en Ocre Profundo; las atendidas se ven en Gris Grafito.
- **Acciones de cada consulta:** botón secundario "Responder por WhatsApp", que abre una conversación con el teléfono de esa persona, y botón principal "Marcar como atendida".
- Usa los mismos colores, tipografías y botones que el resto del sitio.

## Pantalla de trabajos

- La galería se ve en 3 columnas en computadora, 2 en tablet y 1 en celular.
- Arriba hay botones para filtrar: Todos, Interiores, Durlock, Pintura, Enduido, Machimbre y Molduras.
- Al tocar una tarjeta, la foto se abre en grande con su descripción.

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
