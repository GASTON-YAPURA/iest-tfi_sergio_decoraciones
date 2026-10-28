"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/trabajos", texto: "Trabajos" },
  { href: "/nosotros", texto: "Nosotros" },
];

export default function MenuPrincipal() {
  const rutaActual = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function alternarMenu() {
    setMenuAbierto((abierto) => !abierto);
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function estaActivo(href) {
    if (href === "/") {
      return rutaActual === "/";
    }

    return rutaActual.startsWith(href);
  }

  return (
    <div className="menu">
      <button
        type="button"
        className="menu-boton"
        aria-expanded={menuAbierto}
        aria-controls="menu-principal"
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        onClick={alternarMenu}
      >
        <span className="menu-icono" aria-hidden="true">
          <span className="menu-linea" />
          <span className="menu-linea" />
          <span className="menu-linea" />
        </span>
      </button>

      <nav
        id="menu-principal"
        className={`menu-navegacion ${menuAbierto ? "menu-abierto" : ""}`}
        aria-label="Menú principal"
      >
        <ul className="menu-lista">
          {ENLACES.map((enlace) => {
            const activo = estaActivo(enlace.href);

            return (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className={`menu-enlace ${activo ? "menu-enlace-activo" : ""}`}
                  aria-current={activo ? "page" : undefined}
                  onClick={cerrarMenu}
                >
                  {enlace.texto}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/contacto"
              className="boton-principal menu-contacto"
              onClick={cerrarMenu}
            >
              Contacto
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
