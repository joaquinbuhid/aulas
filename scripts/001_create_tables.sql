-- Tabla de edificios
CREATE TABLE IF NOT EXISTS edificios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de aulas
CREATE TABLE IF NOT EXISTS aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  edificio_id UUID NOT NULL REFERENCES edificios(id) ON DELETE CASCADE,
  capacidad INTEGER NOT NULL DEFAULT 0,
  detalles TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de movimientos (horarios de clases)
CREATE TABLE IF NOT EXISTS movimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aula_id UUID NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
  hora_desde TIME NOT NULL,
  hora_hasta TIME NOT NULL,
  asignatura TEXT NOT NULL,
  carrera TEXT NOT NULL,
  docente TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de encargados
CREATE TABLE IF NOT EXISTS encargados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  hora_entrada TIME NOT NULL,
  hora_salida TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_aulas_edificio ON aulas(edificio_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_aula ON movimientos(aula_id);
