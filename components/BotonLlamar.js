import {
  NUMERO_TELEFONO,
  crearEnlaceLlamada,
} from "../lib/contacto";

export default function BotonLlamar({
  clase = "boton-secundario",
  mostrarNumero = false,
  children: contenido,
}) {
  return (
    <a
      className={clase}
      href={crearEnlaceLlamada()}
      aria-label={`Llamar al ${NUMERO_TELEFONO}`}
    >
      {contenido ?? (mostrarNumero ? NUMERO_TELEFONO : "Llamar")}
    </a>
  );
}
