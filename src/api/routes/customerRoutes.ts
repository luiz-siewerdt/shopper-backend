import CustomerController from '@api/controllers/CustomerController'
import { Router } from 'express'

const customerRouter = Router()

customerRouter.get('/:code/list', CustomerController.getCustomerMeasures)

export default customerRouter
