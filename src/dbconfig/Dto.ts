import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator'

export class SignupDTO {
  @IsNotEmpty()
  @IsString()
  username!: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
  })
  password!: string
}
