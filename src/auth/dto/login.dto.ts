import { MinLength } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class LoginUserArgs {
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  @MinLength(3)
  password: string;
}
