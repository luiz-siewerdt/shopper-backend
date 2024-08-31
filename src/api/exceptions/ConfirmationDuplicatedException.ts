import errorCodes from '@api/errors/errorCodes'
import ApiError from './ApiError'

class ConfirmationDuplicatedException extends ApiError {
  constructor(description: string) {
    super(errorCodes.CONFIRMATION_DUPLICATED, description, 409)
  }
}

export default ConfirmationDuplicatedException
