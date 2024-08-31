import sizeOf from 'image-size'
import { MeasureTypes } from '@prisma/client'
import errorDescriptions from '@api/errors/errorDescriptions'
import ConfirmationDuplicatedException from '@api/exceptions/ConfirmationDuplicatedException'
import DoubleReportException from '@api/exceptions/DoubleReportException'
import InvalidDataException from '@api/exceptions/InvalidDataException'
import InvalidTypeException from '@api/exceptions/InvalidTypeExpection'
import MeasureNotFoundException from '@api/exceptions/MeasureNotFoundException'
import { UploadRequestType } from '@api/types/MeasureTypes'
import prisma from '@libs/prisma'

const BASE64_REGEX =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/

function validMeasureTypeOrError(value: MeasureTypes) {
  if (!Object.keys(MeasureTypes).includes(value)) {
    throw new InvalidTypeException(errorDescriptions.invalidMeasureType)
  }
}

function extractBase64Data(base64Str: string): string {
  return base64Str.replace(/^data:image\/\w+;base64,/, '')
}

function validBase64OrError(base64Str: string) {
  const base64Data = extractBase64Data(base64Str)
  if (!BASE64_REGEX.test(base64Data)) {
    throw new InvalidDataException(errorDescriptions.invalidBase64)
  }
}

async function validBase64ImageOrError(base64Str: string): Promise<string> {
  validBase64OrError(base64Str)
  const base64Data = extractBase64Data(base64Str)
  try {
    const imageBuffer = Buffer.from(base64Data, 'base64')
    const { type } = sizeOf(imageBuffer)

    return type ?? ''
  } catch {
    throw new InvalidDataException(errorDescriptions.invalidImage)
  }
}

async function existsReaderAndError({
  measure_datetime,
  customer_code,
  measure_type,
}: UploadRequestType) {
  const date = new Date(measure_datetime)
  const year = date.getFullYear()
  const month = date.getMonth()

  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)

  const alreadyHaveReader = await prisma.measure.findFirst({
    where: {
      customer_code,
      measure_type,
      measure_datetime: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  if (alreadyHaveReader) throw new DoubleReportException(errorDescriptions.alreadyRead)
}

async function measureReadedOrNotExistsAndError(measure_uuid: string) {
  const measureExists = await prisma.measure.findFirst({ where: { measure_uuid } })
  if (!measureExists) {
    throw new MeasureNotFoundException(errorDescriptions.alreadyRead)
  } else if (measureExists.has_confirmed) {
    throw new ConfirmationDuplicatedException(errorDescriptions.alreadyRead)
  }
}

export {
  validMeasureTypeOrError,
  validBase64ImageOrError,
  existsReaderAndError,
  measureReadedOrNotExistsAndError,
}
