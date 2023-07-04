import http from 'http'
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

  try {
    response.status(200).send(data)
  } catch (err) {
    response.status(500).send(`Internal Server Error (${err.message})`)
  }
}

function getLinkMetadata(link: string) {
  return new Promise<{
    name: string
    desc?: string
    icon?: string | string[]
  }>((resolve, reject) => {
    const client = link.startsWith('https') ? https : http

    client.get(link, (resp) => {
      let data = ''

      if (resp.statusCode === 301 || resp.statusCode === 302) {
        return getLinkMetadata(resp.headers.location as string).then(resolve).catch(reject)
      }
  
      resp.on('data', (chunk) => data += chunk)
      resp.on('end', () => {
        let icon: string | string[] = ''
        const matches = data.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]*>/gi)

        if (matches && matches.length > 0) {
          const icons = matches.map((item) => {
            const urlMatch = item.match(/href=["']([^"']+)["']/i)

            return urlMatch && urlMatch.length >= 2 ? urlMatch[1] : ''
          })

          if (icons.length === 1) {
            icon = new URL(icons[0], link).href
          } else {
            icon = icons.map(item => new URL(item, link).href)
          }
        }

        resolve({
          icon,
          name: data.match(/<title>(.*?)<\/title>/)?.[1] || '',
          desc: data.match(/<meta\s+name="description"\s+content="([^"]+)"\s*\/?>/i)?.[1] || ''
        })
      })
    }).on('error', (err) => reject(err))
  })
}
