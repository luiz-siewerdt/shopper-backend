import request from 'supertest'
import { Measure } from '@prisma/client'
import app from '../src/app'
import { prismaMock } from '../singleton'
import * as measureValidators from '@utils/validators/measureValidators'
import getMeasureValue from '@utils/getMeasureValue'
import errorDescriptions from '@api/errors/errorDescriptions'
import errorCodes from '@api/errors/errorCodes'
import DoubleReportException from '@api/exceptions/DoubleReportException'
import { UploadRequestTestType, ConfirmMeasureTestType } from '@api/types/MeasureTypes'

jest.mock('@utils/validators/measureValidators', () => {
  const originalModule = jest.requireActual('@utils/validators/measureValidators')
  return {
    ...originalModule,
    validBase64ImageOrError: jest.fn().mockResolvedValue('png'),
    validBase64OrError: jest.fn(),
    existsReaderAndError: jest.fn(),
  }
})

jest.mock('@utils/getMeasureValue', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(123123),
}))

jest.mock('@utils/uploadImage', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue('url'),
}))

const mockedMeasure: Measure = {
  image_url: 'url',
  created_at: new Date(),
  measure_type: 'GAS',
  measure_uuid: 'uuid',
  customer_code: 'code',
  has_confirmed: false,
  measure_value: 123,
  measure_datetime: new Date(),
}

describe('Testing /upload', () => {
  const defaultBody: UploadRequestTestType = {
    measure_datetime: new Date().toString(),
    customer_code: 'code',
    measure_type: 'GAS',
    image: 'base64',
  }
  it('Should return OK in POST method', async () => {
    prismaMock.measure.create.mockResolvedValue(mockedMeasure)

    const response = await request(app.getApp())
      .post('/upload')
      .set('Content-Type', 'application/json')
      .send(defaultBody)
      .expect(200)

    expect(response.body.image_url).toBe(mockedMeasure.image_url)
    expect(response.body.measure_uuid).toBe(mockedMeasure.measure_uuid)
    expect(response.body.measure_value).toBe(mockedMeasure.measure_value)
  })

  describe('Testing InvalidTypeExceptions', () => {
    it('Should throw because measure_datetime is invalid', async () => {
      const body = { ...defaultBody }
      delete body.measure_datetime

      const response = await request(app.getApp())
        .post('/upload')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(400)

      expect(response.body.error_code).toBe(errorCodes.INVALID_DATA)
      expect(response.body.error_description).toBe(errorDescriptions.invalidDateTime)
    })

    it('Should throw because customer_code is invalid', async () => {
      const body = { ...defaultBody }
      delete body.customer_code

      const response = await request(app.getApp())
        .post('/upload')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(400)

      expect(response.body.error_code).toBe(errorCodes.INVALID_DATA)
      expect(response.body.error_description).toBe(errorDescriptions.invalidCustomerCode)
    })

    it('Should throw because measure_type is invalid', async () => {
      const body = { ...defaultBody }
      body.measure_type = 'WA'

      const response = await request(app.getApp())
        .post('/upload')
        .set('Content-Type', 'application/json')
        .send(body)

      expect(response.body.error_code).toBe(errorCodes.INVALID_TYPE)
      expect(response.body.error_description).toBe(errorDescriptions.invalidMeasureType)
    })

    it('Should throw because cannot get measure from the image', async () => {
      ; (getMeasureValue as jest.Mock).mockResolvedValue(NaN)
      const body = { ...defaultBody }

      const response = await request(app.getApp())
        .post('/upload')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(400)

      expect(response.body.error_code).toBe(errorCodes.INVALID_DATA)
      expect(response.body.error_description).toBe(errorDescriptions.cannotGetMeasureFromImage)
    })

    it('Should throw because base64 is not a image', async () => {
      ; (measureValidators.validBase64ImageOrError as jest.Mock).mockResolvedValue('')
      const body = { ...defaultBody }

      const response = await request(app.getApp())
        .post('/upload')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(400)

      expect(response.body.error_code).toBe(errorCodes.INVALID_DATA)
      expect(response.body.error_description).toBe(errorDescriptions.invalidImage)
    })

    it('Should throw because alredy exists a reader', async () => {
      ; (measureValidators.existsReaderAndError as jest.Mock).mockImplementation(() => {
        throw new DoubleReportException(errorDescriptions.alreadyRead)
      })
      const body = { ...defaultBody }

      const response = await request(app.getApp())
        .post('/upload')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(409)

      expect(response.body.error_code).toBe(errorCodes.DOUBLE_REPORT)
      expect(response.body.error_description).toBe(errorDescriptions.alreadyRead)
    })
  })
})

describe('Testing /confirm', () => {
  const defaultBody: ConfirmMeasureTestType = {
    measure_uuid: 'uuid',
    confirmed_value: 1001,
  }
  it('Should return OK in PATCH method', async () => {
    prismaMock.measure.findFirst.mockResolvedValue(mockedMeasure)
    prismaMock.measure.update.mockResolvedValue(mockedMeasure)

    const response = await request(app.getApp())
      .patch('/confirm')
      .set('Content-Type', 'application/json')
      .send(defaultBody)
      .expect(200)

    expect(response.body.success).toBe(true)
  })

  describe('Testing expections', () => {
    it('Should throw because not founded measure', async () => {
      prismaMock.measure.findFirst.mockResolvedValue(null)

      const response = await request(app.getApp())
        .patch('/confirm')
        .set('Content-Type', 'application/json')
        .send(defaultBody)
        .expect(404)

      expect(response.body.error_code).toBe(errorCodes.MEASURE_NOT_FOUND)
      expect(response.body.error_description).toBe(errorDescriptions.alreadyRead)
    })

    it('Should throw because confirmation as duplicated', async () => {
      const measureDuplicated = { ...mockedMeasure }
      measureDuplicated.has_confirmed = true
      prismaMock.measure.findFirst.mockResolvedValue(measureDuplicated)

      const response = await request(app.getApp())
        .patch('/confirm')
        .set('Content-Type', 'application/json')
        .send(defaultBody)
        .expect(409)

      expect(response.body.error_code).toBe(errorCodes.CONFIRMATION_DUPLICATED)
      expect(response.body.error_description).toBe(errorDescriptions.alreadyRead)
    })
  })
})
