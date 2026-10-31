# Spec 003: Panel de Administración de Consultas

## 1. Contexto y Objetivos
Sergio necesita un espacio privado, seguro y protegido por credenciales para administrar y visualizar las consultas enviadas por los clientes a través del sitio web, priorizando las más recientes.

## 2. Requisitos Funcionales (Notación EARS)
- **RF09:** Cuando un usuario intente acceder a la ruta privada `/admin`, el sistema exigirá el ingreso de un usuario y contraseña mediante una interfaz protegida.
- **RF10:** Cuando el administrador inicie sesión correctamente, el sistema mostrará un listado completo de las consultas recibidas ordenadas de forma cronológica (las más recientes primero).
- **RF11:** Cuando el administrador haga clic en marcar una consulta como atendida, el sistema actualizará el estado de la misma en la base de datos.

## 3. Casos Límite (Edge Cases)
- Si un usuario no autenticado intenta acceder a cualquier subruta de `/admin`, el sistema lo redirigirá automáticamente a la pantalla de inicio de sesión.
- Si se ingresa una contraseña incorrecta, el sistema denegará el acceso y mostrará un mensaje genérico de error de credenciales por seguridad.

## 4. Fuera de Alcance
- Registro múltiple de usuarios administradores (el sistema está diseñado exclusivamente para una única cuenta correspondiente a Sergio).
- Recuperación automatizada de contraseña por correo electrónico (la clave se administra mediante variables de entorno cifradas).

## 5. Criterios de Finalización ("Listo cuando...")
- La sesión se protege mediante cookies seguras (`httpOnly`, `secure`, `sameSite: strict`).
- La contraseña se valida comparando su hash mediante `bcryptjs`.
- El listado de consultas muestra correctamente los datos almacenados en PostgreSQL.