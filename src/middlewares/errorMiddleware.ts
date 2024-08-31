import { NextFunction, Request, Response } from 'express'
import ApiError from '@api/exceptions/ApiError'
import errorCodes from '@api/errors/errorCodes'
import errorDescriptions from '@api/errors/errorDescriptions'

function logError(err: ApiError, req: Request, res: Response, next: NextFunction) {
  console.log(err)
  next(err)
}

function errorMiddleware(err: ApiError, req: Request, res: Response, next: NextFunction) {
  next()
  // if the err is instanceof Error
  if (!(err instanceof ApiError)) {
    err = new ApiError(errorCodes.INTERNAL_SERVER_ERROR, errorDescriptions.internalError, 500)
  }

  return res.status(err.error_status).json({
    error_code: err.error_code,
    error_description: err.error_description,
  })
}

export { logError, errorMiddleware }
