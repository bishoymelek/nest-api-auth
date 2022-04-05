import { IsEmail, IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UserRoles } from '../../shared/user-roles';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userRole?: UserRoles;
}
