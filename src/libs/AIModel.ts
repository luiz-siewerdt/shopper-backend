import env from '@config/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY!)

const AIModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export default AIModel
