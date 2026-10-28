import Image from "next/image";
import { redirect } from "next/navigation";
import FormularioIngreso from "../../components/FormularioIngreso";
import { leerSesion } from "../../lib/sesion";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ingreso | Sergio Decoraciones",
};

export default async function PaginaIngreso() {
  // Si Sergio ya tiene una sesion abierta, va directo a sus consultas.
  const sesion = await leerSesion();

  if (sesion) {
    redirect("/admin/consultas");
  }

  return (
    <section className="seccion admin-seccion">
      <div className="contenedor admin-ingreso-contenido">
        <div className="admin-tarjeta">
          <Image
            src="/img/marca/logo-sd-dorado.png"
            alt="Monograma SD de Sergio Decoraciones"
            width={88}
            height={104}
            className="admin-monograma"
          />

          <h1>Panel de consultas</h1>
          <p className="admin-bajada">
            Ingresá con tu usuario y contraseña para ver las consultas que
            recibiste.
          </p>

          <FormularioIngreso />
        </div>
      </div>
    </section>
  );
}
