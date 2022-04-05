import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Auth')
export class AuthType {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;
}
