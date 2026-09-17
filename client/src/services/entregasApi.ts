import type { ApiResponse, Entrega, EntregaInput } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.message || 'No se pudo completar la solicitud')
  }
  return body
}

export const entregasApi = {
  listar: () => request<ApiResponse<Entrega[]>>('/entregas'),
  crear: (entrega: EntregaInput) =>
    request<ApiResponse<Entrega>>('/entregas', {
      method: 'POST',
      body: JSON.stringify(entrega),
    }),
  actualizar: (id: string, cambios: Partial<EntregaInput>) =>
    request<ApiResponse<Entrega>>(`/entregas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cambios),
    }),
  eliminar: (id: string) =>
    request<ApiResponse<null>>(`/entregas/${id}`, { method: 'DELETE' }),
}

