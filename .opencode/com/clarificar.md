# Informe de Clarificación - Spec 001: Galería de Trabajos

Fecha de revisión: Octubre de 2026
Proyecto: Sergio Decoraciones

## 1. Hallazgos y Preguntas Abiertas del Agente (QA)

Durante la revisión del archivo `spec.md` para la galería de trabajos, el agente auditor identificó los siguientes puntos que requieren confirmación:

- **Duda 1 (Almacenamiento de imágenes):** El spec menciona que se mostrará una galería de fotos de alta calidad, pero no especifica si las imágenes se cargarán desde una base de datos PostgreSQL o desde un directorio estático local optimizado en `public/`.
  - *Propuesta del agente:* Dado que el emprendimiento inicial no requiere un panel para subir fotos por ahora (según el TP3), se sugiere utilizar una tabla en PostgreSQL para los metadatos (título, categoría, URL de la imagen) y almacenar los archivos multimedia optimizados en un bucket o en la carpeta pública del proyecto.

- **Duda 2 (Paginación o scroll infinito):** No se detalla el comportamiento si el volumen de fotos de trabajos terminados crece considerablemente con el tiempo.
  - *Propuesta del agente:* Para la primera versión (MVP), mostrar todas las fotos agrupadas con diseño responsivo de grilla (*grid*), o implementar un límite inicial de 9 elementos con un botón "Ver más" si fuera necesario.

- **Duda 3 (Comportamiento del Modal):** En el RF03 se menciona la apertura de una foto en grande mediante un modal.
  - *Propuesta del agente:* Confirmar si el modal debe incluir la descripción detallada del trabajo y un botón directo que diga "Consultar sobre este trabajo por WhatsApp" (lo cual integraría el RF05 de contacto).

## 2. Decisiones Tomadas por el Desarrollador (Sergio / Gastón)

- **Sobre la Duda 1:** Se almacenarán los registros en la base de datos PostgreSQL de Neon tal como se definió en las tecnologías del TP3, asegurando tiempos de carga rápidos.
- **Sobre la Duda 2:** Por el momento se mantendrá una grilla responsiva simple sin paginación compleja, ya que el catálogo inicial de trabajos terminados es acotado.
- **Sobre la Duda 3:** **Aprobado.** El modal incluirá la foto en grande, su descripción técnica y un botón directo con mensaje prellenado a WhatsApp para potenciar la conversión de clientes.