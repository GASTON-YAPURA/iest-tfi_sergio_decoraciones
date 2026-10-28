import { Cinzel, Lato } from "next/font/google";
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
      <body>{contenido}</body>
    </html>
  );
}
