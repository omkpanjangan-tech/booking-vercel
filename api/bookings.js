import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // ===============================
    // GET → Ambil semua booking
    // ===============================
    if (req.method === 'GET') {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Booking!A2:J',
      });

      return res.status(200).json(response.data.values || []);
    }

    // ===============================
    // POST → Tambah booking baru
    // ===============================
    if (req.method === 'POST') {
      const body = req.body;

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Booking!A:J',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            new Date().toLocaleString(),
            body.nama,
            body.lingkungan,
            body.ruangan,
            body.tanggal,
            body.mulai,
            body.selesai,
            body.keperluan,
            body.email,
            body.whatsapp
          ]]
        }
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}