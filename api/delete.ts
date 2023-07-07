import { getGoogleSheetsClients } from '../common/googleSheets'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/*
  * @param {string} sheetId - The id of the google sheet to fetch
  * @param {string} token - The token to authenticate the request, generation method: crypto.randomBytes(16).toString('hex')
  * @param {string} link - The website link
*/
export default async (request: VercelRequest, response: VercelResponse) => {
  const { token = '', sheetId = '', link = '' } = request.body

  if (token !== process.env.TOKEN) {
    return response.status(401).send('Unauthorized')
  }

  if (!sheetId) {
    return response.status(400).send('Missing sheetId')
  }

  if (!link) {
    return response.status(400).send('Missing link')
  }

  try {
    const { auth, sheets } = await getGoogleSheetsClients(process.env.CLIENT_EMAIL!, process.env.PRIVATE_KEY!)

    const result = await sheets.spreadsheets.values.get({
      auth,
      range: 'Sheet1!D:D',
      spreadsheetId: sheetId as string
    })

    if (result.data.values) {
      const index = result.data.values.findIndex(item => item[0] === link) + 1

      if (index) {
        await sheets.spreadsheets.values.clear({
          auth,
          spreadsheetId: sheetId as string,
          range: `Sheet1!${index}:${index}`
        })

        response.status(200).end()
      } else {
        response.status(404).send('Not Found')
      }
    }
  } catch (err) {
    response.status(500).send(`Internal Server Error (${err.message})`)
  }
}
