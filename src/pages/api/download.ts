import fs from 'fs'

export default async function GET(request: any, res: any) {
  const { searchParams } = new URL(request.url)
  const filePath = decodeURIComponent(searchParams.get('filePath') ?? '')
  console.log('filePath is ', filePath)
  try {
    // Security Check 2: Sanitize filename and handle potential undefined from pop()
    const safeFileName =
      filePath
        .split('/')
        .pop()
        ?.replace(/[^a-zA-Z0-9._-]/g, '') ?? 'downloaded_file'

    // Read the file
    const fileData = fs.readFileSync(filePath)

    return new res(fileData, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeFileName}"`
      }
    })
  } catch (error) {
    console.error('Error reading file:', error)

    return res.json({ error: 'File not found' }, { status: 404 })
  }
}
