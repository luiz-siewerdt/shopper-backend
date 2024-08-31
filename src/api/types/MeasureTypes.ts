import { MeasureTypes } from '@prisma/client'

export type UploadRequestType = {
  image: string
  customer_code: string
  measure_datetime: string
  measure_type: MeasureTypes
}

export type ConfirmMeasureType = {
  measure_uuid: string
  confirmed_value: number
}

export type UploadRequestTestType = {
  image?: string
  customer_code?: string
  measure_datetime?: string
  measure_type?: string
}

export type ConfirmMeasureTestType = {
  measure_uuid?: string
  confirmed_value?: number
}
