# Spec 001: Trabajos Terminados

## 1. Contexto y Objetivos
Los clientes de Sergio Decoraciones necesitan visualizar ejemplos reales de trabajos anteriores (empapelados, durlock, pintura, molduras) para evaluar la calidad del servicio antes de contactarlo. El objetivo es proporcionar una galería de fotos organizada, limpia y optimizada para dispositivos móviles.

## 2. Requisitos Funcionales (Notación EARS)
- **RF01:** Cuando el usuario acceda a la sección de trabajos, el sistema mostrará una galería completa con las fotografías de los trabajos terminados.
- **RF02:** Cuando el usuario seleccione un filtro por tipo de servicio, el sistema filtrará instantáneamente las imágenes para mostrar únicamente las de esa categoría.
- **RF03:** Si el usuario hace clic sobre una fotografía de la galería, el sistema abrirá un componente modal con la imagen en gran tamaño para apreciar los detalles.

## 3. Casos Límite (Edge Cases)
- Si una categoría seleccionada no contiene elementos, el sistema mostrará un aviso textual indicando: "No hay trabajos disponibles en esta categoría actualmente".
- Si las imágenes tardan en cargar, se aplicarán esqueletos de carga (*skeletons*) y compresión en formato WebP para cuidar el rendimiento.

## 4. Fuera de Alcance
- La carga de nuevas imágenes de trabajos por parte de clientes o desde la interfaz pública (la gestión de contenidos se realiza directamente en la base de datos).
- Sistema de comentarios o valoraciones públicas en las fotos.

## 5. Criterios de Finalización ("Listo cuando...")
- La galería es completamente responsiva (mobile first desde 360 px).
- El filtrado responde en menos de 100 milisegundos.
- Se respetan de forma estricta los tokens de color y tipografías definidos en la Constitución del proyecto.