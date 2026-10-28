-- Trabajos de muestra. Solo se cargan si la tabla esta vacia.
INSERT INTO trabajos (titulo, servicio, descripcion, foto, texto_alt, visible)
SELECT * FROM (
  VALUES
    (
      'Living con empapelado',
      'interiores',
      'Empapelado de una pared del living con terminación prolija.',
      '/img/trabajos/living-empapelado.jpg',
      'Living con una pared empapelada y molduras blancas',
      TRUE
    ),
    (
      'Cielorraso de durlock',
      'durlock',
      'Cielorraso de durlock con iluminación embutida.',
      '/img/trabajos/cielorraso-durlock.jpg',
      'Cielorraso de durlock con iluminación embutida',
      TRUE
    ),
    (
      'Dormitorio pintado',
      'pintura',
      'Pintura de un dormitorio en tonos claros.',
      '/img/trabajos/dormitorio-pintado.jpg',
      'Dormitorio pintado en tonos claros con terminación prolija',
      TRUE
    ),
    (
      'Paredes con enduido',
      'enduido',
      'Enduido y lijado de paredes para una terminación lisa.',
      '/img/trabajos/paredes-enduido.jpg',
      'Paredes interiores con enduido y terminación lisa',
      TRUE
    ),
    (
      'Piso de machimbre',
      'machimbre',
      'Colocación de piso de machimbre en un ambiente luminoso.',
      '/img/trabajos/piso-machimbre.jpg',
      'Piso de machimbre colocado en un ambiente luminoso',
      TRUE
    ),
    (
      'Molduras en el salón',
      'molduras',
      'Colocación de molduras decorativas en paredes y techo.',
      '/img/trabajos/molduras-salon.jpg',
      'Salón con molduras decorativas en paredes y techo',
      TRUE
    )
) AS datos(titulo, servicio, descripcion, foto, texto_alt, visible)
WHERE NOT EXISTS (SELECT 1 FROM trabajos);
