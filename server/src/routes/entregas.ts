import { Router, type Request, type Response } from 'express'
import { supabase } from '../supabase.js'
import type { EntregaInput } from '../types.js'

export const entregasRouter = Router()
const prioridades = ['baja', 'media', 'alta']

function validar(body: Partial<EntregaInput>, parcial = false): string | null {
  if (!parcial && (!body.titulo || !body.materia || !body.fecha_limite || !body.prioridad)) return 'Título, materia, fecha y prioridad son obligatorios'
  if (body.titulo !== undefined && (!body.titulo.trim() || body.titulo.length > 80)) return 'El título debe tener entre 1 y 80 caracteres'
  if (body.materia !== undefined && (!body.materia.trim() || body.materia.length > 60)) return 'La materia debe tener entre 1 y 60 caracteres'
  if (body.descripcion !== undefined && body.descripcion.length > 300) return 'La descripción no puede superar 300 caracteres'
  if (body.prioridad !== undefined && !prioridades.includes(body.prioridad)) return 'La prioridad no es válida'
  if (body.fecha_limite !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(body.fecha_limite)) return 'La fecha no es válida'
  return null
}

entregasRouter.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from('entregas').select('*').order('completada').order('fecha_limite')
  if (error) return res.status(500).json({ message: 'No se pudieron cargar las entregas', detail: error.message })
  return res.json({ data })
})

entregasRouter.post('/', async (req: Request, res: Response) => {
  const errorValidacion = validar(req.body)
  if (errorValidacion) return res.status(400).json({ message: errorValidacion })
  const entrada: EntregaInput = { ...req.body, titulo: req.body.titulo.trim(), materia: req.body.materia.trim(), descripcion: req.body.descripcion?.trim() || '', completada: Boolean(req.body.completada) }
  const { data, error } = await supabase.from('entregas').insert(entrada).select().single()
  if (error) return res.status(500).json({ message: 'No se pudo crear la entrega', detail: error.message })
  return res.status(201).json({ data, message: 'Entrega creada' })
})

entregasRouter.put('/:id', async (req: Request, res: Response) => {
  const errorValidacion = validar(req.body, true)
  if (errorValidacion) return res.status(400).json({ message: errorValidacion })
  const campos = ['titulo', 'materia', 'descripcion', 'fecha_limite', 'prioridad', 'completada']
  const cambios = Object.fromEntries(Object.entries(req.body).filter(([clave]) => campos.includes(clave)))
  if (!Object.keys(cambios).length) return res.status(400).json({ message: 'No hay campos válidos para actualizar' })
  const { data, error } = await supabase.from('entregas').update(cambios).eq('id', req.params.id).select().single()
  if (error) return res.status(error.code === 'PGRST116' ? 404 : 500).json({ message: 'No se pudo actualizar la entrega', detail: error.message })
  return res.json({ data, message: 'Entrega actualizada' })
})

entregasRouter.delete('/:id', async (req: Request, res: Response) => {
  const { error, count } = await supabase.from('entregas').delete({ count: 'exact' }).eq('id', req.params.id)
  if (error) return res.status(500).json({ message: 'No se pudo eliminar la entrega', detail: error.message })
  if (!count) return res.status(404).json({ message: 'La entrega no existe' })
  return res.json({ data: null, message: 'Entrega eliminada' })
})

