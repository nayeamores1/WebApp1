import { useEffect, useState, type FormEvent } from 'react'
import { CalendarDays, X } from 'lucide-react'
import type { Entrega, EntregaInput, Prioridad } from '../types'

interface Props {
  entrega?: Entrega | null
  guardando: boolean
  onGuardar: (datos: EntregaInput) => Promise<void>
  onCerrar: () => void
}

const inicial: EntregaInput = {
  titulo: '', materia: '', descripcion: '', fecha_limite: '', prioridad: 'media', completada: false,
}

export function EntregaForm({ entrega, guardando, onGuardar, onCerrar }: Props) {
  const [form, setForm] = useState<EntregaInput>(inicial)

  useEffect(() => {
    setForm(entrega ? {
      titulo: entrega.titulo,
      materia: entrega.materia,
      descripcion: entrega.descripcion,
      fecha_limite: entrega.fecha_limite,
      prioridad: entrega.prioridad,
      completada: entrega.completada,
    } : inicial)
  }, [entrega])

  const enviar = async (event: FormEvent) => {
    event.preventDefault()
    await onGuardar(form)
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-header">
          <div>
            <span className="eyebrow">{entrega ? 'EDITAR ENTREGA' : 'NUEVA ENTREGA'}</span>
            <h2 id="form-title">{entrega ? 'Actualiza los detalles' : 'Añade un proyecto'}</h2>
          </div>
          <button className="icon-button" onClick={onCerrar} aria-label="Cerrar"><X size={20} /></button>
        </div>

        <form onSubmit={enviar}>
          <label>Título del proyecto
            <input required maxLength={80} placeholder="Ej. Prototipo de aplicación" value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </label>
          <label>Materia
            <input required maxLength={60} placeholder="Ej. Portafolio" value={form.materia}
              onChange={(e) => setForm({ ...form, materia: e.target.value })} />
          </label>
          <label>Descripción <span className="optional">(opcional)</span>
            <textarea maxLength={300} rows={3} placeholder="Notas, requisitos o detalles importantes..." value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </label>
          <div className="form-grid">
            <label>Fecha límite
              <div className="input-icon"><CalendarDays size={17} /><input required type="date" value={form.fecha_limite}
                onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })} /></div>
            </label>
            <label>Prioridad
              <select value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value as Prioridad })}>
                <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="button secondary" onClick={onCerrar}>Cancelar</button>
            <button className="button primary" disabled={guardando}>{guardando ? 'Guardando...' : entrega ? 'Guardar cambios' : 'Crear entrega'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

