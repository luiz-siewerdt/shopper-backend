import customerRouter from '@api/routes/customerRoutes'
import measureRouter from '@api/routes/measureRoutes'
import cors from '@middlewares/cors'
import { errorMiddleware, logError } from '@middlewares/errorMiddleware'
import express, { json } from 'express'
import path from 'path'

class App {
  private app = express()

  constructor() {
    this.setupMiddlewares()
    this.setupRoutes()
    this.setupErrors()
  }

  private setupMiddlewares() {
    this.app.use(cors)
    this.app.use(json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private setupRoutes() {
    this.app.use(measureRouter)
    this.app.use(customerRouter)
    this.app.use('/temp', express.static(path.join(__dirname, '..', 'temp')))
  }

  private setupErrors() {
    this.app.use(logError)
    this.app.use(errorMiddleware)
  }

  listen(port: number) {
    this.app.listen(port, () => console.log(`Backend rodando na porta ${port}`))
  }

  getApp() {
    return this.app
  }
}

export default new App()
