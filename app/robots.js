import { crearUrlSitio } from "../lib/sitio";

// Google puede leer el sitio publico; el panel y las rutas internas no.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: crearUrlSitio("/sitemap.xml"),
  };
}
