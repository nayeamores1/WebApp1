import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, ClipboardList, LoaderCircle, Plus, RefreshCw, Search } from 'lucide-react'
import { EntregaCard } from './components/EntregaCard'
import { EntregaForm } from './components/EntregaForm'
import { entregasApi } from './services/entregasApi'
import type { Entrega, EntregaInput } from './types'

type Filtro = 'todas' | 'pendientes' | 'completadas'

export default function App() {
  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState<Entrega | null>(null)
  const [guardando, setGuardando] = useState(false)

  const cargar = async () => {
    setCargando(true); setError('')
    try { const respuesta = await entregasApi.listar(); setEntregas(respuesta.data) }
    catch (e) { setError(e instanceof Error ? e.message : 'Error inesperado') }
    finally { setCargando(false) }
  }

  useEffect(() => { void cargar() }, [])
  useEffect(() => { if (!mensaje) return; const id = setTimeout(() => setMensaje(''), 2600); return () => clearTimeout(id) }, [mensaje])

  const visibles = useMemo(() => entregas.filter((item) => {
    const coincideFiltro = filtro === 'todas' || (filtro === 'completadas' ? item.completada : !item.completada)
    const texto = `${item.titulo} ${item.materia}`.toLowerCase()
    return coincideFiltro && texto.includes(busqueda.toLowerCase())
  }), [entregas, filtro, busqueda])

  const guardar = async (datos: EntregaInput) => {
    setGuardando(true); setError('')
    try {
      if (editando) {
        const { data } = await entregasApi.actualizar(editando.id, datos)
        setEntregas((actuales) => actuales.map((item) => item.id === data.id ? data : item))
        setMensaje('Entrega actualizada correctamente')
      } else {
        const { data } = await entregasApi.crear(datos)
        setEntregas((actuales) => [data, ...actuales])
        setMensaje('Nueva entrega creada')
      }
      setModal(false); setEditando(null)
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar') }
    finally { setGuardando(false) }
  }

  const toggle = async (entrega: Entrega) => {
    try {
      const { data } = await entregasApi.actualizar(entrega.id, { completada: !entrega.completada })
      setEntregas((actuales) => actuales.map((item) => item.id === data.id ? data : item))
      setMensaje(data.completada ? '¡Entrega completada!' : 'Entrega marcada como pendiente')
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo actualizar') }
  }

  const eliminar = async (entrega: Entrega) => {
    if (!window.confirm(`¿Eliminar “${entrega.titulo}”?`)) return
    try { await entregasApi.eliminar(entrega.id); setEntregas((a) => a.filter((i) => i.id !== entrega.id)); setMensaje('Entrega eliminada') }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo eliminar') }
  }

  const totalCompletadas = entregas.filter((e) => e.completada).length
  const progreso = entregas.length ? Math.round((totalCompletadas / entregas.length) * 100) : 0

  return (
    <div className="app-shell">
      <header className="topbar"><a className="brand" href="#"><span className="brand-mark"><CheckCircle2 /></span><span>Al<span>Día</span></span></a></header>
      <main>
        <section className="hero">
          <div><span className="eyebrow">PANEL DE ENTREGAS</span><h1>Organiza tus ideas.<br/><em>Entrega a tiempo.</em></h1><p>Todos tus proyectos de diseño, fechas y prioridades en un solo lugar.</p></div>
          <div className="progress-card"><div className="progress-ring" style={{ '--progress': `${progreso * 3.6}deg` } as React.CSSProperties}><span>{progreso}%</span></div><div><strong>Progreso general</strong><small>{totalCompletadas} de {entregas.length} entregas completadas</small></div></div>
        </section>

        {mensaje && <div className="toast success"><CheckCircle2 size={18}/>{mensaje}</div>}
        {error && <div className="alert"><AlertCircle size={19}/><span>{error}</span><button onClick={() => setError('')}>×</button></div>}

        <section className="workspace">
          <div className="toolbar">
            <div className="tabs" role="tablist">{(['todas','pendientes','completadas'] as Filtro[]).map((opcion) => <button key={opcion} className={filtro === opcion ? 'active' : ''} onClick={() => setFiltro(opcion)}>{opcion[0].toUpperCase()+opcion.slice(1)} <span>{opcion === 'todas' ? entregas.length : entregas.filter(e => opcion === 'completadas' ? e.completada : !e.completada).length}</span></button>)}</div>
            <div className="toolbar-actions"><label className="search"><Search size={17}/><input aria-label="Buscar entregas" placeholder="Buscar proyecto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/></label><button className="button primary" onClick={() => { setEditando(null); setModal(true) }}><Plus size={18}/> Nueva entrega</button></div>
          </div>

          {cargando ? <div className="state"><LoaderCircle className="spin"/><h2>Cargando entregas...</h2></div> : visibles.length ? <div className="cards-grid">{visibles.map((entrega) => <EntregaCard key={entrega.id} entrega={entrega} onToggle={toggle} onEditar={(e) => {setEditando(e); setModal(true)}} onEliminar={eliminar}/>)}</div> : <div className="state empty"><ClipboardList/><h2>{busqueda ? 'No encontramos coincidencias' : 'Tu lista está vacía'}</h2><p>{busqueda ? 'Prueba con otro nombre o materia.' : 'Crea tu primera entrega para comenzar a organizarte.'}</p>{error && <button className="button secondary" onClick={cargar}><RefreshCw size={17}/> Reintentar</button>}</div>}
        </section>
      </main>
      <footer>AlDia · 2026</footer>
      {modal && <EntregaForm entrega={editando} guardando={guardando} onGuardar={guardar} onCerrar={() => {setModal(false); setEditando(null)}}/>}
    </div>
  )
}

