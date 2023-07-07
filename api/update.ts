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
  const { token = '', sheetId = '', link = '', name = '', icon = '', desc = '', category = '', round = 0 } = request.body

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

    const result = await sheets.spreadsheets.values.get({
      auth,
      range: 'Sheet1!D:D',
      spreadsheetId: sheetId as string
    })

    if (result.data.values) {
      const index = result.data.values.findIndex(item => item[0] === link) + 1

      if (index) {
        await sheets.spreadsheets.values.update({
          auth,
          valueInputOption: 'USER_ENTERED',
          spreadsheetId: sheetId as string,
          range: `Sheet1!${index}:${index}`,
          requestBody: { values: [[name, icon, desc, link, category, round]] }
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
