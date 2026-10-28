// El panel de Sergio es privado: no debe aparecer en los buscadores.
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LayoutAdmin({ children: contenido }) {
  return <>{contenido}</>;
}
