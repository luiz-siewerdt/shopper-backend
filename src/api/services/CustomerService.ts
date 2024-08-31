import prisma from '@libs/prisma'
import { MeasureTypes } from '@prisma/client'
import { customerExistsOrError } from '@utils/validators/customerValidators'
import { validMeasureTypeOrError } from '@utils/validators/measureValidators'

class CustomerService {
  async getCustomerMeasures(customer_code: string, measure_type?: MeasureTypes) {
    if (measure_type) {
      validMeasureTypeOrError(measure_type)
    }

    await customerExistsOrError(customer_code)
    const response = await prisma.customer.findUnique({
      where: { customer_code },
      include: {
        measures: {
          where: { measure_type: measure_type ?? undefined },
          select: {
            measure_uuid: true,
            measure_datetime: true,
            measure_type: true,
            has_confirmed: true,
            image_url: true,
          },
        },
      },
    })

    return response
  }
}

export default new CustomerService()
