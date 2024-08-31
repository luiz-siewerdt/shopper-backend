import errorCodes from '@api/errors/errorCodes'
import ApiError from './ApiError'

class DoubleReportException extends ApiError {
  constructor(description: string) {
    super(errorCodes.DOUBLE_REPORT, description, 409)
  }
}

export default DoubleReportException
