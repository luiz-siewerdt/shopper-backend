import errorDescriptions from '@api/errors/errorDescriptions'
import InvalidDataException from '@api/exceptions/InvalidDataException'
import { ConfirmMeasureType, UploadRequestType } from '@api/types/MeasureTypes'
import prisma from '@libs/prisma'
import getMeasureValue from '@utils/getMeasureValue'
import uploadImage from '@utils/uploadImage'
import { customerExistsOrCreate } from '@utils/validators/customerValidators'
import {
  validDateTimeOrError,
  validNumberOrError,
  validStringOrError,
} from '@utils/validators/genericValidators'
import {
  existsReaderAndError,
  measureReadedOrNotExistsAndError,
  validBase64ImageOrError,
  validMeasureTypeOrError,
} from '@utils/validators/measureValidators'

class MeasureService {
  async uploadMeasure(body: UploadRequestType) {
    const { measure_datetime, measure_type, customer_code, image } = body

    validStringOrError(measure_datetime, errorDescriptions.invalidDateTime)
    validStringOrError(customer_code, errorDescriptions.invalidCustomerCode)
    validStringOrError(image, errorDescriptions.invalidBase64)
    validDateTimeOrError(measure_datetime, errorDescriptions.invalidDateTime)
    validMeasureTypeOrError(measure_type)
    customerExistsOrCreate(customer_code)

    const extension = await validBase64ImageOrError(image)

    await existsReaderAndError(body)

    validStringOrError(extension, errorDescriptions.invalidImage)

    const measureValue = await getMeasureValue(image, extension)

    if (isNaN(measureValue)) {
      throw new InvalidDataException(errorDescriptions.cannotGetMeasureFromImage)
    }

    const createTemporaryLink = uploadImage(image)

    const measure = await prisma.measure.create({
      data: {
        measure_datetime,
        customer_code,
        measure_type,
        image_url: createTemporaryLink,
        measure_value: measureValue,
      },
    })

    return {
      image_url: measure.image_url,
      measure_value: measure.measure_value,
      measure_uuid: measure.measure_uuid,
    }
  }

  async confirmMeasure(body: ConfirmMeasureType) {
    const { measure_uuid, confirmed_value } = body
    validStringOrError(measure_uuid, errorDescriptions.invalidMeasureUUID)
    validNumberOrError(confirmed_value, errorDescriptions.invalidConfirmedValue)

    await measureReadedOrNotExistsAndError(measure_uuid)

    await prisma.measure.update({
      where: { measure_uuid },
      data: { has_confirmed: true, measure_value: confirmed_value },
    })
  }
}

export default new MeasureService()
