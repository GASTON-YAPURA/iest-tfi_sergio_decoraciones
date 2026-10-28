# Skill: verificar-criterios

Esta skill permite auditar automáticamente que el código del proyecto cumpla de forma estricta con los principios establecidos en `docs/CONSTITUCION.md`.

## Instrucciones de ejecución:
1. Revisa que no existan estilos o colores escritos a mano (hardcodeados) en componentes de React, validando que se utilicen únicamente las variables CSS de `docs/IDENTIDAD-MARCA.md`.
2. Comprueba que la base de datos se consuma exclusivamente a través de la capa de servicios autorizada y que los componentes de la interfaz no ejecuten consultas SQL directamente.
3. Verifica que los archivos sensibles y credenciales estén protegidos mediante variables de entorno y no se expongan en el cliente.