import MeasureService from '@api/services/MeasureService'
import { NextFunction, Request, Response } from 'express'

class MeasureController {
  async uploadMeasure(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await MeasureService.uploadMeasure(req.body)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }

  async confirmMeasure(req: Request, res: Response, next: NextFunction) {
    try {
      await MeasureService.confirmMeasure(req.body)
      res.status(200).json({ success: true })
    } catch (err) {
      next(err)
    }
  }
}

export default new MeasureController()
