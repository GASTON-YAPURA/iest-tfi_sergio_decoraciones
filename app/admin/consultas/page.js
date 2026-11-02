import Link from "next/link";
import NavegacionPanel from "../../../components/NavegacionPanel";
import TablaConsultas from "../../../components/TablaConsultas";
import {
  contarConsultas,
  listarConsultas,
} from "../../../lib/consultas";
import {
  ESTADOS,
  normalizarBusqueda,
  normalizarEstado,
  normalizarPagina,
} from "../../../lib/filtros-consultas";
import { formatearFechaConsulta } from "../../../lib/fechas";
import { exigirSesion } from "../../../lib/sesion";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Consultas | Sergio Decoraciones",
};

function armarUrl({ busqueda, estado, pagina }) {
  const parametros = new URLSearchParams();

  if (busqueda) {
    parametros.set("buscar", busqueda);
  }

  if (estado && estado !== "todas") {
    parametros.set("estado", estado);
  }

  if (pagina > 1) {
    parametros.set("pagina", String(pagina));
  }

  const texto = parametros.toString();

  return texto ? `/admin/consultas?${texto}` : "/admin/consultas";
}

function armarUrlPdf(busqueda, estado) {
  const parametros = new URLSearchParams();

  if (busqueda) {
    parametros.set("buscar", busqueda);
  }

  if (estado !== "todas") {
    parametros.set("estado", estado);
  }

  const texto = parametros.toString();

  return `/api/admin/consultas/pdf${texto ? `?${texto}` : ""}`;
}

function mensajeVacio(busqueda, estado) {
  if (busqueda) {
    return "No hay consultas que coincidan con la búsqueda.";
  }

  if (estado === "archivadas") {
    return "Todavía no archivaste ninguna consulta.";
  }

  if (estado === "pendientes") {
    return "No quedan consultas pendientes.";
  }

  if (estado === "atendidas") {
    return "Todavía no marcaste ninguna consulta como atendida.";
  }

  return "Todavía no recibiste consultas.";
}

export default async function PaginaConsultas({ searchParams }) {
  await exigirSesion();

  const parametros = (await searchParams) ?? {};
  const busqueda = normalizarBusqueda(parametros.buscar);
  const estado = normalizarEstado(parametros.estado);
  const pagina = normalizarPagina(parametros.pagina);

  let datos = { consultas: [], total: 0, pagina: 1, paginas: 1 };
  let resumen = { pendientes: 0, atendidas: 0, total: 0, archivadas: 0 };
  let errorBase = false;

  try {
    [datos, resumen] = await Promise.all([
      listarConsultas({ busqueda, estado, pagina }),
      contarConsultas(),
    ]);
  } catch (error) {
    errorBase = true;
    console.error("No se pudieron cargar las consultas", error);
  }

  const filas = datos.consultas.map((consulta) => ({
    id: consulta.id,
    nombre: consulta.nombre,
    telefono: consulta.telefono,
    mensaje: consulta.mensaje,
    atendida: consulta.atendida,
    archivada: consulta.archivada,
    fecha_texto: formatearFechaConsulta(consulta.creada_en),
  }));

  return (
    <>
      <section className="seccion admin-seccion">
        <div className="contenedor">
          <div className="admin-encabezado">
            <div>
              <p className="portada-etiqueta">Panel privado</p>
              <h1>Consultas recibidas</h1>
              <p className="admin-bajada">
                Buscá, respondé y ordená las consultas del sitio. Las más
                recientes aparecen primero.
              </p>
            </div>

            <div className="admin-encabezado-acciones">
              <NavegacionPanel actual="consultas" />
              <form action="/api/admin/salir" method="post">
                <button type="submit" className="boton-secundario">
                  Salir
                </button>
              </form>
            </div>
          </div>

          {errorBase ? (
            <p className="formulario-error" role="alert">
              No pudimos cargar las consultas. Recargá la página y probá de
              nuevo.
            </p>
          ) : (
            <>
              <div className="admin-resumen" aria-label="Resumen de consultas">
                <Link
                  className="admin-dato admin-dato-destacado"
                  href={armarUrl({ busqueda, estado: "pendientes", pagina: 1 })}
                >
                  <span className="admin-dato-numero">{resumen.pendientes}</span>
                  <span className="admin-dato-etiqueta">Pendientes</span>
                </Link>

                <Link
                  className="admin-dato"
                  href={armarUrl({ busqueda, estado: "atendidas", pagina: 1 })}
                >
                  <span className="admin-dato-numero">{resumen.atendidas}</span>
                  <span className="admin-dato-etiqueta">Atendidas</span>
                </Link>

                <div className="admin-dato">
                  <span className="admin-dato-numero">{resumen.total}</span>
                  <span className="admin-dato-etiqueta">Total</span>
                </div>
              </div>

              <div className="admin-herramientas">
                <form
                  className="admin-buscador"
                  action="/admin/consultas"
                  method="get"
                  role="search"
                >
                  {estado !== "todas" ? (
                    <input type="hidden" name="estado" value={estado} />
                  ) : null}

                  <label className="visualmente-oculto" htmlFor="buscar">
                    Buscar por nombre o teléfono
                  </label>
                  <input
                    id="buscar"
                    name="buscar"
                    type="search"
                    defaultValue={busqueda}
                    placeholder="Buscar por nombre o teléfono"
                  />
                  <button
                    type="submit"
                    className="boton-secundario boton-chico"
                  >
                    Buscar
                  </button>

                  {busqueda ? (
                    <Link
                      className="admin-limpiar"
                      href={armarUrl({ busqueda: "", estado, pagina: 1 })}
                    >
                      Limpiar
                    </Link>
                  ) : null}
                </form>

                <div
                  className="admin-filtros"
                  role="group"
                  aria-label="Filtrar consultas por estado"
                >
                  {ESTADOS.map((opcion) => (
                    <Link
                      key={opcion.id}
                      className={`filtro-boton ${
                        estado === opcion.id ? "filtro-boton-activo" : ""
                      }`}
                      href={armarUrl({
                        busqueda,
                        estado: opcion.id,
                        pagina: 1,
                      })}
                      aria-current={estado === opcion.id ? "page" : undefined}
                    >
                      {opcion.nombre}
                      {opcion.id === "archivadas" && resumen.archivadas > 0
                        ? ` (${resumen.archivadas})`
                        : ""}
                    </Link>
                  ))}
                </div>

                <a
                  className="boton-secundario boton-chico admin-exportar"
                  href={armarUrlPdf(busqueda, estado)}
                  download
                >
                  Exportar PDF
                </a>
              </div>

              <p className="admin-contador" aria-live="polite">
                {datos.total === 1 ? "1 consulta" : `${datos.total} consultas`}
                {datos.paginas > 1
                  ? ` · página ${datos.pagina} de ${datos.paginas}`
                  : ""}
              </p>

              <TablaConsultas
                consultas={filas}
                mensajeVacio={mensajeVacio(busqueda, estado)}
              />

              {datos.paginas > 1 ? (
                <nav
                  className="admin-paginado"
                  aria-label="Páginas de consultas"
                >
                  {datos.pagina > 1 ? (
                    <Link
                      className="boton-secundario boton-chico"
                      href={armarUrl({
                        busqueda,
                        estado,
                        pagina: datos.pagina - 1,
                      })}
                    >
                      Anterior
                    </Link>
                  ) : (
                    <span className="admin-paginado-inactivo">Anterior</span>
                  )}

                  <span className="admin-paginado-pagina">
                    Página {datos.pagina} de {datos.paginas}
                  </span>

                  {datos.pagina < datos.paginas ? (
                    <Link
                      className="boton-secundario boton-chico"
                      href={armarUrl({
                        busqueda,
                        estado,
                        pagina: datos.pagina + 1,
                      })}
                    >
                      Siguiente
                    </Link>
                  ) : (
                    <span className="admin-paginado-inactivo">Siguiente</span>
                  )}
                </nav>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
