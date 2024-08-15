import { connect } from 'src/dbconfig/dbconfig'
import User from 'src/dbconfig/userModel'
import jwt from 'jsonwebtoken'

async function handler(req: any, res: any) {
  try {
    connect()
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' })
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' })
    }
    try {
      const decodedToken: any = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET!)
      const { id } = decodedToken
      const userData = await User.findOne({ where: { id } })
      if (userData) {
        const userWithoutPassword = userData.get({ plain: true })
        delete userWithoutPassword.password

        return res.json({
          success: true,
          userData: userWithoutPassword
        })
      } else {
        return res.status(401).json({ success: false, error: 'User not found' })
      }
    } catch (error) {
      console.log(error)
    }
    const decodedToken: any = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET!)
    const { id } = decodedToken
    const userData = await User.findOne({ where: { id } })
    if (userData) {
      return res.json({
        success: true,
        userData
      })
    } else {
      return res.status(401).json({ success: false, error: 'User not found' })
    }
  } catch (error: any) {
    console.error('Error in /api/me:', error)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired' })
    }

    return res.status(500).json({ success: false, error: 'Server error' })
  }
}
export default handler
