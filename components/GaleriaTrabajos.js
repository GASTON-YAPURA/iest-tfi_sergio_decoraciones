"use client";

import { useCallback, useState } from "react";
import { filtrarTrabajosPorServicio } from "../lib/servicios";
import FiltroServicios from "./FiltroServicios";
import TarjetaTrabajo from "./TarjetaTrabajo";
import VisorFoto from "./VisorFoto";

export default function GaleriaTrabajos({ trabajos }) {
  const [servicioActivo, setServicioActivo] = useState("todos");
  const [trabajoAbierto, setTrabajoAbierto] = useState(null);
  const cerrarVisor = useCallback(() => setTrabajoAbierto(null), []);

  const trabajosVisibles = filtrarTrabajosPorServicio(
    trabajos,
    servicioActivo
  );

  return (
    <>
      <FiltroServicios activo={servicioActivo} onCambiar={setServicioActivo} />

      <p className="galeria-conteo" aria-live="polite">
        {trabajosVisibles.length === 1
          ? "1 trabajo"
          : `${trabajosVisibles.length} trabajos`}
      </p>

      {trabajosVisibles.length > 0 ? (
        <ul className="grilla-trabajos">
          {trabajosVisibles.map((trabajo) => (
            <li key={trabajo.id}>
              <TarjetaTrabajo
                trabajo={trabajo}
                onAbrir={() => setTrabajoAbierto(trabajo)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="galeria-vacia">
          No hay trabajos de este servicio por ahora.
        </p>
      )}

      {trabajoAbierto ? (
        <VisorFoto trabajo={trabajoAbierto} onCerrar={cerrarVisor} />
      ) : null}
    </>
  );
}
