import type { NextApiRequest, NextApiResponse } from 'next/types'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'ok',
    message: 'SoffCRM frontend is healthy',
    timestamp: new Date().toISOString(),
  })
}
