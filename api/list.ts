import { getGoogleSheetsClients } from '../common/googleSheets'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/*
  * @param {string} sheetId - The id of the google sheet to fetch
  * @param {string} token - The token to authenticate the request, generation method: crypto.randomBytes(16).toString('hex')
*/
export default async (request: VercelRequest, response: VercelResponse) => {
  const { token = '', sheetId = '' } = request.query

  if (token !== process.env.TOKEN) {
    return response.status(401).send('Unauthorized')
  }

  if (!sheetId) {
    return response.status(400).send('Missing sheetId')
  }

  try {
    const { auth, sheets } = await getGoogleSheetsClients(process.env.CLIENT_EMAIL!, process.env.PRIVATE_KEY!)

    const result = await sheets.spreadsheets.values.get({
      auth,
      range: 'Sheet1',
      spreadsheetId: sheetId as string
    })

    if (result.data.values) {
      response.status(200).send(result.data.values.map(row => ({ name: row[0], icon: row[1], desc: row[2], link: row[3], category: row[4], round: row[5] ? parseInt(row[5], 10) : undefined })))
    } else {
      response.status(200).send([])
    }
  } catch (err) {
    response.status(500).send(`Internal Server Error (${err.message})`)
  }
}
