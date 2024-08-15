import { connect } from 'src/dbconfig/dbconfig'
import Developer from 'src/dbconfig/developerUserModel'
import User from 'src/dbconfig/userModel'

export default async function GET(req: any, res: any) {
  try {
    await connect()
    const developers = await Developer.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        }
      ]
    })
    console.log(developers)
    return res.json({ success: true, developers })
  } catch (error) {
    console.error('Error fetching developers:', error)

    return res.json({ success: false, error: 'Error fetching developers' })
  }
}
