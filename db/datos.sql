-- Trabajos de muestra. Solo se cargan si la tabla esta vacia.
-- Las fotos no van aca: se importan con "npm run db:fotos" desde multimedia/trabajos/.
INSERT INTO trabajos (titulo, servicio, descripcion, visible)
SELECT * FROM (
  VALUES
    (
      'Living con alfombrado y empapelado',
      'interiores',
      'Alfombrado y empapelado de una pared del living, con terminacion prolija.',
      TRUE
    ),
    (
      'Cielorraso de durlock',
      'durlock',
      'Cielorraso de durlock con iluminacion embutida.',
      TRUE
    ),
    (
      'Pintura general',
      'pintura',
      'Pintura de paredes y techo en tonos claros.',
      TRUE
    ),
    (
      'Paredes con enduido',
      'enduido',
      'Enduido y lijado de paredes para una terminacion lisa.',
      TRUE
    ),
    (
      'Piso de machimbre',
      'machimbre',
      'Colocacion de piso de machimbre en un ambiente luminoso.',
      TRUE
    ),
    (
      'Molduras en el salon',
      'molduras',
      'Colocacion de molduras decorativas en paredes y techo.',
      TRUE
    )
) AS datos(titulo, servicio, descripcion, visible)
WHERE NOT EXISTS (SELECT 1 FROM trabajos);
