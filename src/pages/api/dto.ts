import { plainToInstance } from 'class-transformer'
import { SignupDTO } from '../../dbconfig/Dto'
import { validate } from 'class-validator'

export default async function POST(request: any, response: any) {
  try {
    const reqBody = await request.body

    // Transform and validate request body using DTO
    const signupData = plainToInstance(SignupDTO, reqBody)
    const errors = await validate(signupData)

    if (errors.length > 0) {
      return response.json({ errors: errors.map(err => err.constraints), dtosuccess: false })
    } else {
      return response.json({ errors, dtosuccess: true })
    }
  } catch (error: any) {
    return response.json({ error: error.message }, { status: 400 })
  }
}
