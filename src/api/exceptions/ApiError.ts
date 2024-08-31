class ApiError extends Error {
  error_code: string
  error_description: string
  error_status: number

  constructor(code: string, description: string, status: number) {
    super()
    this.error_code = code
    this.error_description = description
    this.error_status = status
  }
}

export default ApiError
