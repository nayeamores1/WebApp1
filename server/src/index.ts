import 'dotenv/config'
import cors from 'cors'
import express, { type Request, type Response, type NextFunction } from 'express'
import { entregasRouter } from './routes/entregas.js'

const app = express()
const port = Number(process.env.PORT) || 4000

app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*' }))
app.use(express.json({ limit: '100kb' }))

app.get('/', (_req, res) => res.json({ message: 'API de AlDía funcionando', status: 'ok' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/entregas', entregasRouter)

app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada' }))
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)
  res.status(500).json({ message: 'Error interno del servidor' })
})

app.listen(port, () => console.log(`API disponible en http://localhost:${port}`))

