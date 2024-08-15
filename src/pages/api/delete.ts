import { connect } from 'src/dbconfig/dbconfig'
import Developer from 'src/dbconfig/developerUserModel'
import { unlink } from 'fs/promises'

export default async function DELETE(request: any, res: any) {
  try {
    connect()
    const reqBody = request.body
    const id = reqBody.id
    const row = await Developer.findOne({ where: { id } })
    const row2 = (await Developer.findOne({ where: { id } }))?.dataValues
    const filePath = row2.resume
    if (!row) {
      console.log('user not found')

      return res.json({ message: 'Invalid delete operation', success: false })
    }

    await row.destroy()
    await unlink(filePath)

    return res.json({ success: true, message: `Developer with id ${id} deleted successfully` })
  } catch (error: any) {
    return res.json({ error: error.message }, { status: 500 })
  }
}
