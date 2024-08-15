import fs from 'fs'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { connect } from 'src/dbconfig/dbconfig'
import Developer from 'src/dbconfig/developerUserModel'
import formidable from 'formidable'
import jwt from 'jsonwebtoken'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function POST(request: any, res: any) {
  const form = formidable({})
  try {
    connect()
    form.parse(request, async function (err, fields, files) {
      if (err) {
        console.error('Error parsing form data:', err)

        return res.status(500).json({ success: false, error: 'Error parsing form data' })
      }
      const authorizationHeader = request.headers.authorization

      if (!authorizationHeader) {
        return res.status(401).json({ success: false, error: 'Authorization header missing' })
      }

      const token = authorizationHeader.split(' ')[1]
      try {
        const decodedToken: any = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET!)
        const { id } = decodedToken
        const { name, date } = fields
        const nameString = Array.isArray(name) ? name[0] : name
        const dateString = Array.isArray(date) ? date[0] : date

        // Check if resumeFile exists and handle case if no file is provided
        if (files.file && files.file.length > 0) {
          const resumeFile = files.file[0] // Type assertion here

          const uploadDir = join(process.cwd(), 'public', 'uploads')
          const filename = Date.now() + '_' + resumeFile.originalFilename
          const filepath = join(uploadDir, filename)
          await writeFile(filepath, fs.readFileSync(resumeFile.filepath))

          await Developer.create({
            name: nameString,
            date: dateString,
            created_by: id,
            resume: `public/uploads/${filename}` // Store the relative path
          })

          res.status(200).json({ success: true, message: 'developer created' })
        } else {
          return res.status(400).json({ success: false, error: 'No resume file provided' })
        }
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, error: 'Error parsing form data' })
      }
    })
  } catch (error) {
    console.error('Error parsing form data:', error)
    res.status(500).json({ success: false, error: 'Error parsing form data' })
  }
}
