# Spec 002: Formulario de Contacto y Canales Directos

## 1. Contexto y Objetivos
Facilitar una vía de comunicación rápida, limpia y directa entre los clientes y Sergio. Se busca combinar canales tradicionales (llamadas y WhatsApp con mensaje prellenado) junto con un formulario de consulta web formal que guarde los datos en la base de datos.

## 2. Requisitos Funcionales (Notación EARS)
- **RF05:** Cuando el usuario haga clic en el botón flotante o fijo de WhatsApp, el sistema abrirá una ventana externa con un mensaje prellenado listo para enviar a Sergio.
- **RF06:** Cuando el usuario haga clic en el botón de llamada telefónica, el sistema activará el discador del dispositivo con el número de contacto del emprendimiento.
- **RF07:** Cuando el usuario complete y envíe el formulario de consulta web con sus datos, el sistema validará la información en el servidor y almacenará el mensaje de forma segura en la base de datos PostgreSQL.

## 3. Casos Límite (Edge Cases)
- Si el usuario deja campos obligatorios vacíos en el formulario, el sistema bloqueará el envío y mostrará una alerta de error visible.
- Si ocurre un fallo en la conexión con la base de datos al enviar el formulario, el sistema informará al usuario que intente nuevamente o utilice el canal directo de WhatsApp.

## 4. Fuera de Alcance
- Envío automático de correos electrónicos de confirmación al cliente (por ahora solo se almacena la consulta para que Sergio la responda).
- Chatbots o respuestas automáticas de inteligencia artificial en el sitio web.

## 5. Criterios de Finalización ("Listo cuando...")
- El formulario valida entradas en el servidor evitando inyecciones o datos maliciosos.
- Los botones de WhatsApp y llamadas son accesibles y operan correctamente tanto en mobile como en desktop.