import errorCodes from '@api/errors/errorCodes'
import ApiError from './ApiError'

class InvalidDataException extends ApiError {
  constructor(error_description: string) {
    super(errorCodes.INVALID_DATA, error_description, 400)
  }
}

export default InvalidDataException
