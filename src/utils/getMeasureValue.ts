import AIModel from '@libs/AIModel'

const getMeasureValue = async (base64Str: string, extension: string): Promise<number> => {
  const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '')
  const result = await AIModel.generateContent([
    'Get only the value from the register for me',
    { inlineData: { data: base64Data, mimeType: `image/${extension}` } },
  ])

  const text = result.response.text()
  return getNumberFromString(text)
}

const getNumberFromString = (text: string): number => {
  const match = text.replace(/^\D+/g, '')
  const number = match.split(' ')[0]
  return Number(number)
}

export default getMeasureValue
