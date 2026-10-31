import { crearUrlSitio } from "../lib/sitio";

// Solo las paginas publicas: el panel privado no se lista.
const PAGINAS = [
  { ruta: "/", changeFrequency: "monthly", priority: 1 },
  { ruta: "/servicios", changeFrequency: "monthly", priority: 0.9 },
  { ruta: "/trabajos", changeFrequency: "weekly", priority: 0.9 },
  { ruta: "/nosotros", changeFrequency: "yearly", priority: 0.6 },
  { ruta: "/contacto", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap() {
  const ultimaRevision = new Date();

  return PAGINAS.map((pagina) => ({
    url: crearUrlSitio(pagina.ruta),
    lastModified: ultimaRevision,
    changeFrequency: pagina.changeFrequency,
    priority: pagina.priority,
  }));
}
