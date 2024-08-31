import errorCodes from '@api/errors/errorCodes'
import ApiError from './ApiError'

class InvalidTypeException extends ApiError {
  constructor(description: string) {
    super(errorCodes.INVALID_TYPE, description, 400)
  }
}

export default InvalidTypeException
