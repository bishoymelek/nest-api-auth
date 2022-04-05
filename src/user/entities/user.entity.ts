import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectType, Field } from '@nestjs/graphql';
import { UserRoles } from '../../shared/user-roles';

@ObjectType('User')
export class UserType {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsOptional()
  userRole?: UserRoles;
}
