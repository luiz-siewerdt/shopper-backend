import errorCodes from '@api/errors/errorCodes'
import ApiError from './ApiError'
import errorDescriptions from '@api/errors/errorDescriptions'

class MeasuresNotFoundException extends ApiError {
  constructor() {
    super(errorCodes.MEASURE_NOT_FOUND, errorDescriptions.measureNotFound, 404)
  }
}

export default MeasuresNotFoundException
