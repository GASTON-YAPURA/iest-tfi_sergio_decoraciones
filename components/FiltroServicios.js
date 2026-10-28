"use client";

import { SERVICIOS } from "../lib/servicios";

const OPCIONES = [
  { id: "todos", etiqueta: "Todos" },
  ...SERVICIOS.map((servicio) => ({
    id: servicio.id,
    etiqueta: servicio.etiqueta,
  })),
];

export default function FiltroServicios({ activo, onCambiar }) {
  return (
    <div
      className="filtro-servicios"
      role="group"
      aria-label="Filtrar trabajos por servicio"
    >
      {OPCIONES.map((opcion) => (
        <button
          key={opcion.id}
          type="button"
          className={`filtro-boton ${
            activo === opcion.id ? "filtro-boton-activo" : ""
          }`}
          aria-pressed={activo === opcion.id}
          onClick={() => onCambiar(opcion.id)}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
}
