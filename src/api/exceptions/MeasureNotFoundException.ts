import errorCodes from '@api/errors/errorCodes'
import ApiError from './ApiError'

class MeasureNotFoundException extends ApiError {
  constructor(description: string) {
    super(errorCodes.MEASURE_NOT_FOUND, description, 404)
  }
}

export default MeasureNotFoundException
