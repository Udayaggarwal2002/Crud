import { connect } from 'src/dbconfig/dbconfig'
import User from 'src/dbconfig/userModel'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

async function handler(req: any, res: any) {
  try {
    connect()
    const reqBody = req.body
    const { email, password } = reqBody

    //check if user exists
    const user = (await User.findOne({ where: { email } }))?.dataValues
    if (!user) {
      return res.json({ error: 'User does not exist' }, { status: 400 })
    }

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password) // use (user as any)
    if (!validPassword) {
      return res.json({ error: 'Invalid password' }, { status: 400 })
    }

    //create token data
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email
    }

    //create token
    const token = await jwt.sign(tokenData, process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET!, { expiresIn: '1d' })
    delete user.password
    try {
      const response = res.json({
        user,
        success: true,
        accessToken: token
      })

      return response
    } catch (error) {
      console.log(error)
    }
  } catch (error: any) {
    return res.json({ error: error.message }, { status: 500 })
  }
}

export default handler
