import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserArgs {
  @Field()
  email: string;

  @Field()
  password: string;
}
