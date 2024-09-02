import CustomerService from '@api/services/CustomerService'
import { MeasureTypes } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

class CustomerController {
  async getCustomerMeasures(req: Request, res: Response, next: NextFunction) {
    try {
      const measure_type: MeasureTypes | null =
        (req.query.measure_type?.toString().toUpperCase() as keyof typeof MeasureTypes) ?? null
      const response = await CustomerService.getCustomerMeasures(req.params.code, measure_type)
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
}

export default new CustomerController()
