import { google } from 'googleapis'

export const getGoogleSheetsClients = async (clientEmail: string, privateKey: string) => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      'client_email': clientEmail,
      'private_key': privateKey.replace(/\\n/g, '\n')
    },
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  })

  const client = await auth.getClient() as any
  const sheets = google.sheets({ version: 'v4', auth: client })

  return { auth, sheets }
}
