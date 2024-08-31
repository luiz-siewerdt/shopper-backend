import env from '@config/env'
import cors, { CorsOptions } from 'cors'

const config: CorsOptions = {
  origin: env.FRONTEND_URL,
}

export default cors(config)
