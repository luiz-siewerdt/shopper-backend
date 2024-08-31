import path from 'path'
import fs from 'fs'
import env from '@config/env'

export default function uploadImage(base64Str: string): string {
  const imageData = base64Str.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(imageData, 'base64')

  const imageName = `${new Date()}.png`.replaceAll(' ', '-')
  const imagePath = path.join(__dirname, '..', '..', 'temp', imageName)

  fs.writeFileSync(imagePath, buffer)

  const tempLink = `${env.BACKEND_URL}/temp/${imageName}`

  setTimeout(
    () => {
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete temporary image:', err)
      })
    },
    60 * 1000 * 60 // 1 hour
  )

  return tempLink
}
