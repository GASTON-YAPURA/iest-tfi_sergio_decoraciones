// El texto alternativo es obligatorio y tiene un largo razonable.
export function revisarTextoAlt(texto) {
  const limpio = typeof texto === "string" ? texto.trim() : "";

  if (limpio.length < 5) {
    return "Escribí un texto alternativo de al menos 5 caracteres.";
  }

  if (limpio.length > 200) {
    return "El texto alternativo no puede superar los 200 caracteres.";
  }

  return null;
}
