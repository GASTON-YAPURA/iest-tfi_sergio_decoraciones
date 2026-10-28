// Servicios de Sergio. Los identificadores coinciden con la columna servicio de la tabla trabajos.
export const SERVICIOS = [
  {
    id: "interiores",
    nombre: "Trabajos de interiores",
    detalle: "Empapelado y alfombra",
    descripcion:
      "Renovamos paredes y pisos con empapelado y alfombra, cuidando la preparación y el terminado de cada ambiente.",
    incluye: [
      "Empapelado de paredes",
      "Colocación de alfombra",
      "Preparación de la superficie",
    ],
  },
  {
    id: "durlock",
    nombre: "Durlock",
    detalle: "Interior y exterior",
    descripcion:
      "Armamos tabiques, cielorrasos y revestimientos de yeso para dividir o renovar ambientes.",
    incluye: ["Tabiques y paredes", "Cielorrasos", "Revestimientos"],
  },
  {
    id: "pintura",
    nombre: "Pintura en general",
    detalle: "Interior y exterior",
    descripcion:
      "Pintamos interiores y exteriores con preparación previa y una terminación pareja.",
    incluye: ["Interiores", "Exteriores", "Preparación y protección"],
  },
  {
    id: "enduido",
    nombre: "Enduido",
    detalle: "Interior y exterior",
    descripcion:
      "Dejamos paredes y techos lisos con enduido y lijado antes de pintar.",
    incluye: ["Interiores", "Exteriores", "Lijado y terminación"],
  },
  {
    id: "machimbre",
    nombre: "Colocación de machimbre",
    detalle: "Trabajo de terminación",
    descripcion:
      "Colocamos pisos de machimbre con ajuste cuidado y una terminación prolija.",
    incluye: ["Preparación del piso", "Colocación", "Terminación"],
  },
  {
    id: "molduras",
    nombre: "Colocación de molduras",
    detalle: "Trabajo de terminación",
    descripcion:
      "Sumamos molduras decorativas en paredes y techos para darle carácter a cada ambiente.",
    incluye: ["Paredes", "Techos", "Detalles decorativos"],
  },
];

export function obtenerNombreServicio(id) {
  const servicio = SERVICIOS.find((item) => item.id === id);

  return servicio ? servicio.nombre : id;
}
