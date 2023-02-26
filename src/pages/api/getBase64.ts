import { NextApiRequest, NextApiResponse } from 'next'
import {getPlaiceholder} from 'plaiceholder'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const response = await Promise.all(req.body.map(async (data: any, index: any) => {
    const { base64, img } = await getPlaiceholder(data.url)
    data.base64 = base64
    return {
      ...img,
      base64: base64
    }
  }))
  return res.status(200).send(response)

}