import MeasureController from '@api/controllers/MeasureController'
import { Router } from 'express'

const measureRouter = Router()
measureRouter.post('/upload', MeasureController.uploadMeasure)
measureRouter.patch('/confirm', MeasureController.confirmMeasure)

export default measureRouter
