import https from 'https'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/*
  * @param {string} token - The token to authenticate the request, generation method: crypto.randomBytes(16).toString('hex')
  * @param {string} link - The link to extract metadata from
*/
export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === 'OPTIONS') {
    return response.status(200).end()
  }

  const { link = '', token = '' } = request.body

  if (token !== process.env.TOKEN) {
    return response.status(401).send('Unauthorized')
  }

  if (!link) {
    return response.status(400).send('Missing link')
  }

  const data = await getLinkMetadata(link as string)

  if (data.icon && data.icon.indexOf('http') === -1) {
    data.icon = link.indexOf('https') !== -1 ? data.icon.replace(/^\/\//, 'https://') : data.icon.replace(/^\/\//, 'http://')
  }

  try {
    response.status(200).send(data)
  } catch (err) {
    response.status(500).send(`Internal Server Error (${err.message})`)
  }
}

function getLinkMetadata(link: string) {
  return new Promise<{
    name: string
    icon?: string
    desc?: string
  }>((resolve, reject) => {
    https.get(link, (resp) => {
      let data = ''
  
      resp.on('data', (chunk) => data += chunk)
      resp.on('end', () => {
        resolve({
          name: data.match(/<title>(.*?)<\/title>/)?.[1] || '',
          icon: data.match(/<link rel="shortcut icon" href="(.*?)"/)?.[1] || '',
          desc: data.match(/<meta name="description" content="(.*?)"/)?.[1] || ''
        })
      })
    }).on('error', (err) => reject(err))
  })
}
