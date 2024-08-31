import 'dotenv/config'

const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}

export default env
