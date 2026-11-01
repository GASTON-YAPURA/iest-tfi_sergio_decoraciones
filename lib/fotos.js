// Direccion pública de una foto guardada en la base.
// Es una funcion pura para poder usarla tambien en el navegador.
export function urlFoto(trabajoId, fotoId) {
  return `/api/trabajos/${trabajoId}/foto?foto=${fotoId}`;
}
