import { getGoogleSheetsClients } from '../common/googleSheets'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/*
  * @param {string} sheetId - The id of the google sheet to fetch
  * @param {string} token - The token to authenticate the request, generation method: crypto.randomBytes(16).toString('hex')
  * @param {string} link - The website link
  * @param {string} name - The website name
  * @param {string} icon - The website icon
  * @param {string} desc - The website description
  * @param {string} category - The website category
*/
export default async (request: VercelRequest, response: VercelResponse) => {
  const { token = '', sheetId = '' } = request.query
  const { link = '', name = '', icon = '', desc = '', category = '' } = request.body

  if (token !== process.env.TOKEN) {
    return response.status(401).send('Unauthorized')
  }

  if (!sheetId) {
    return response.status(400).send('Missing sheetId')
  }

  if (!link || !name || !icon) {
    return response.status(400).send('Missing link or name or icon')
  }

  try {
    const { auth, sheets } = await getGoogleSheetsClients(process.env.CLIENT_EMAIL!, process.env.PRIVATE_KEY!)
    
    await sheets.spreadsheets.values.append({
      auth,
      range: `Sheet1`,
      valueInputOption: 'USER_ENTERED',
      spreadsheetId: sheetId as string,
      requestBody: { values: [[name, icon, desc, link, category]] }
    })

    response.status(200).send('done')
  } catch (err) {
    response.status(500).send(`Internal Server Error (${err.message})`)
  }
}
