import Link from "next/link";

// Cambia entre las dos secciones del panel sin escribir la direccion.
export default function NavegacionPanel({ actual }) {
  return (
    <nav className="admin-navegacion" aria-label="Secciones del panel">
      <Link
        className="admin-navegacion-enlace"
        href="/admin/consultas"
        aria-current={actual === "consultas" ? "page" : undefined}
      >
        Consultas
      </Link>
      <Link
        className="admin-navegacion-enlace"
        href="/admin/trabajos"
        aria-current={actual === "trabajos" ? "page" : undefined}
      >
        Trabajos
      </Link>
    </nav>
  );
}
