import { CalendarDays, Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import type { Entrega } from '../types'

interface Props {
  entrega: Entrega
  onToggle: (entrega: Entrega) => void
  onEditar: (entrega: Entrega) => void
  onEliminar: (entrega: Entrega) => void
}

function fechaLegible(fecha: string) {
  return new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${fecha}T00:00:00Z`))
}

export function EntregaCard({ entrega, onToggle, onEditar, onEliminar }: Props) {
  const dias = Math.ceil((new Date(`${entrega.fecha_limite}T23:59:59`).getTime() - Date.now()) / 86400000)
  const vencida = !entrega.completada && dias < 0

  return (
    <article className={`entrega-card ${entrega.completada ? 'is-complete' : ''}`}>
      <button className={`check-button ${entrega.completada ? 'checked' : ''}`} onClick={() => onToggle(entrega)}
        aria-label={entrega.completada ? 'Marcar pendiente' : 'Marcar completada'}>{entrega.completada && <Check size={15} strokeWidth={3} />}</button>
      <div className="card-content">
        <div className="card-topline">
          <span className={`priority ${entrega.prioridad}`}>{entrega.prioridad}</span>
          <span className="course">{entrega.materia}</span>
        </div>
        <h3>{entrega.titulo}</h3>
        {entrega.descripcion && <p>{entrega.descripcion}</p>}
        <div className={`due-date ${vencida ? 'overdue' : ''}`}><CalendarDays size={15} />
          {vencida ? `Venció el ${fechaLegible(entrega.fecha_limite)}` : `Entrega: ${fechaLegible(entrega.fecha_limite)}`}
        </div>
      </div>
      <details className="card-menu">
        <summary aria-label="Acciones"><MoreHorizontal size={20} /></summary>
        <div className="menu-popover">
          <button onClick={() => onEditar(entrega)}><Pencil size={15} /> Editar</button>
          <button className="danger" onClick={() => onEliminar(entrega)}><Trash2 size={15} /> Eliminar</button>
        </div>
      </details>
    </article>
  )
}

