import { connect } from 'src/dbconfig/dbconfig'
import User from 'src/dbconfig/userModel'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

async function handler(req: any, res: any) {
  try {
    connect()
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' })
    }
    const token = authHeader.split(' ')[1]
    try {
      const decodedToken: any = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET!)
      const { email } = decodedToken
      const reqBody = req.body
      const { newPassword, currentPassword } = reqBody
      const testuser = (await User.findOne({ where: { email } }))?.dataValues
      const validPassword = await bcryptjs.compare(currentPassword, testuser.password)
      if (validPassword) {
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)
        testuser.password = hashedPassword
        await User.update(testuser, { where: { email } })
        delete testuser.password
        const response = res.json({
          testuser,
          success: true
        })

        return response
      } else {
        const response = res.json({
          success: false
        })

        return response
      }
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
  }
}
export default handler
