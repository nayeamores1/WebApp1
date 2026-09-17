export type Prioridad = 'baja' | 'media' | 'alta'

export interface EntregaInput {
  titulo: string
  materia: string
  descripcion?: string
  fecha_limite: string
  prioridad: Prioridad
  completada?: boolean
}

