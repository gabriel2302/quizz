import { NextApiRequest, NextApiResponse } from 'next'
import {getPlaiceholder} from 'plaiceholder'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const responseInteractions = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interactions/count`, { next: { revalidate: 60 * 60 } })
  const highlight = await responseInteractions.json()
  await Promise.all(highlight.map(async (data: any, index: any) => {
    const { base64, img } = await getPlaiceholder(data.url)
    data.base64 = base64
    return {
      ...img,
      base64: base64
    }
  }))
  return res.status(200).send(highlight)

}