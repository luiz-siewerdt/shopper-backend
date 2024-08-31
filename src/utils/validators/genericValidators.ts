import InvalidDataException from '@api/exceptions/InvalidDataException'

function validStringOrError(value: string, msg: string) {
  if (!value) throw new InvalidDataException(msg)
  if (Array.isArray(value) && !value.length) throw new InvalidDataException(msg)
  if (typeof value === 'string' && !value.trim().length) throw new InvalidDataException(msg)
}

function validNumberOrError(value: number, msg: string) {
  if (isNaN(value)) {
    throw new InvalidDataException(msg)
  }
}

function validDateTimeOrError(value: string, msg: string) {
  const date = new Date(value)
  if (isNaN(date.getTime())) {
    throw new InvalidDataException(msg)
  }
}

export { validStringOrError, validNumberOrError, validDateTimeOrError }
