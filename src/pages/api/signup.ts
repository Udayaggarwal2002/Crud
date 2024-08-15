import { connect } from '../../dbconfig/dbconfig'
import User from '../../dbconfig/userModel'
import bcryptjs from 'bcryptjs'

export default async function POST(req: any, res: any) {
  try {
    connect()
    const reqBody = req.body
    const { username, email, password } = reqBody

    //check if user already exists
    const user_email = await User.findOne({ where: { email } })

    if (user_email) {
      return res.json({ message: 'User already exists. Try a different email.', success: false })
    }

    //hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      role: 'admin',
      password: hashedPassword,
      fullname: username,
      username,
      email
    })

    await newUser.save()

    //send verification email

    return res.json({
      message: 'User created successfully',
      success: true
    })
  } catch (error: any) {
    console.log({ error })

    return res.json({ error: error.message }, { status: 500 })
  }
}
