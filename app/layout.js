import Image from "next/image";
import Link from "next/link";
import { Cinzel, Lato } from "next/font/google";
import BotonLlamar from "../components/BotonLlamar";
import BotonWhatsApp from "../components/BotonWhatsApp";
import MenuPrincipal from "../components/MenuPrincipal";
import "./globals.css";

// Cinzel se usa solo en titulos y Lato en textos, segun IDENTIDAD-MARCA.md.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--fuente-titulos-cinzel",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--fuente-texto-lato",
  display: "swap",
});

export const metadata = {
  title: "Sergio Decoraciones | Decoración en Tinogasta",
  description:
    "Pintura, durlock, enduido, empapelado, machimbre y molduras en Tinogasta, Catamarca. Mirá nuestros trabajos y consultá por WhatsApp.",
  icons: {
    icon: "/img/marca/logo-sd-dorado.png",
  },
};

export default function LayoutRaiz({ children: contenido }) {
  return (
    <html lang="es" className={`${cinzel.variable} ${lato.variable}`}>
      <body>
        <a className="saltar-contenido" href="#contenido">
          Saltar al contenido
        </a>

        <header className="encabezado">
          <div className="contenedor encabezado-contenido">
            <Link
              href="/"
              className="logo-encabezado"
              aria-label="Sergio Decoraciones, ir al inicio"
            >
              <Image
                src="/img/marca/logo-horizontal-principal.png"
                alt="Logo de Sergio Decoraciones"
                width={200}
                height={64}
                className="logo-escritorio"
                preload
              />
              <Image
                src="/img/marca/logo-sd-dorado.png"
                alt="Monograma SD de Sergio Decoraciones"
                width={44}
                height={52}
                className="logo-movil"
                preload
              />
            </Link>

            <MenuPrincipal />
          </div>
        </header>

        <main id="contenido">{contenido}</main>

        <footer className="pie">
          <div className="contenedor pie-contenido">
            <Image
              src="/img/marca/logo-horizontal-blanco.png"
              alt="Logo de Sergio Decoraciones"
              width={200}
              height={64}
            />

            <div className="pie-contacto">
              <p>Tinogasta, Catamarca</p>
              <BotonWhatsApp clase="enlace-pie">WhatsApp</BotonWhatsApp>
              <BotonLlamar clase="enlace-pie" mostrarNumero />
            </div>
          </div>
        </footer>

        <BotonWhatsApp clase="boton-whatsapp-flotante" flotante />
      </body>
    </html>
  );
}
