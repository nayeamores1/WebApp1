export type Prioridad = 'baja' | 'media' | 'alta'

export interface Entrega {
  id: string
  titulo: string
  materia: string
  descripcion: string
  fecha_limite: string
  prioridad: Prioridad
  completada: boolean
  created_at: string
}

export type EntregaInput = Omit<Entrega, 'id' | 'created_at'>

export interface ApiResponse<T> {
  data: T
  message?: string
}

