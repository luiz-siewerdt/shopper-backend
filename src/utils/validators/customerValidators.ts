import MeasuresNotFoundException from '@api/exceptions/MeasuresNotFound'
import prisma from '@libs/prisma'

const customerExistsOrError = async (customerCode: string) => {
  const customerExists = await prisma.customer.findUnique({
    where: { customer_code: customerCode },
  })
  if (!customerExists) {
    throw new MeasuresNotFoundException()
  }
}

const customerExistsOrCreate = async (customerCode: string) => {
  const customerExists = await prisma.customer.findUnique({
    where: { customer_code: customerCode },
  })
  if (!customerExists) {
    await prisma.customer.create({ data: { customer_code: customerCode } })
  }
}

export { customerExistsOrError, customerExistsOrCreate }
