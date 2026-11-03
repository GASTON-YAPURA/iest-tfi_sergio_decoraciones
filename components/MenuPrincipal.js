"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/trabajos", texto: "Trabajos" },
  { href: "/nosotros", texto: "Nosotros" },
];

export default function MenuPrincipal() {
  const rutaActual = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(false);
  const contenedorMenu = useRef(null);
  const panelAdminActivo = estaActivo("/admin");

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

  // Cierra el menu al cambiar de pagina, por ejemplo con el boton "atras" del celular.
  useEffect(() => {
    setMenuAbierto(false);
  }, [rutaActual]);

  useEffect(() => {
    let componenteActivo = true;

    async function comprobarSesion() {
      try {
        const respuesta = await fetch("/api/admin/sesion", {
          cache: "no-store",
        });

        if (!respuesta.ok) {
          throw new Error("No se pudo comprobar la sesión del panel.");
        }

        const resultado = await respuesta.json();

        if (componenteActivo) {
          setSesionActiva(resultado.autenticada === true);
        }
      } catch (error) {
        console.error("No se pudo comprobar la sesión del panel", error);

        if (componenteActivo) {
          setSesionActiva(false);
        }
      }
    }

    comprobarSesion();
    window.addEventListener("focus", comprobarSesion);

    return () => {
      componenteActivo = false;
      window.removeEventListener("focus", comprobarSesion);
    };
  }, [rutaActual]);

  // Cierra con Escape, al tocar fuera del menu y al volver al tamano de escritorio.
  useEffect(() => {
    if (!menuAbierto) {
      return undefined;
    }

    const contenedorActual = contenedorMenu.current;
    const consultaEscritorio = window.matchMedia("(min-width: 900px)");

    function alPresionarTecla(evento) {
      if (evento.key === "Escape") {
        setMenuAbierto(false);
      }
    }

    function alTocarFuera(evento) {
      if (contenedorActual && !contenedorActual.contains(evento.target)) {
        setMenuAbierto(false);
      }
    }

    function alCambiarPantalla(evento) {
      if (evento.matches) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener("keydown", alPresionarTecla);
    document.addEventListener("pointerdown", alTocarFuera);
    consultaEscritorio.addEventListener("change", alCambiarPantalla);

    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.removeEventListener("pointerdown", alTocarFuera);
      consultaEscritorio.removeEventListener("change", alCambiarPantalla);
    };
  }, [menuAbierto]);

  // Evita que la pagina de fondo se desplace mientras el menu esta abierto.
  useEffect(() => {
    document.body.classList.toggle("cuerpo-menu-abierto", menuAbierto);

    return () => {
      document.body.classList.remove("cuerpo-menu-abierto");
    };
  }, [menuAbierto]);

  return (
    <div className="menu" ref={contenedorMenu}>
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
          {sesionActiva ? (
            <li>
              <Link
                href="/admin"
                className={`menu-enlace ${panelAdminActivo ? "menu-enlace-activo" : ""}`}
                aria-current={panelAdminActivo ? "page" : undefined}
                onClick={cerrarMenu}
              >
                Panel admin
              </Link>
            </li>
          ) : null}
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
