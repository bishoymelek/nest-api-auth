import { Document } from 'mongoose';
import { getRounds, hash } from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRoles } from 'auth/entities/user-roles';

export type UserDocument = User & Document;

@ObjectType('User')
@Schema()
export class User {
  @Field()
  @IsEmail()
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  password: string;

  @Field()
  // @IsOptional()
  @Prop({ required: true })
  userRole: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    // @ts-ignore
    const hashed = await hash(this.password, 10);
    // @ts-ignore
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.pre('findOneAndUpdate', async function (next: any) {
  const updateFields: any = this.getUpdate();
  const password = updateFields.password;
  try {
    const rounds = getRounds(password);
    if (rounds === 0) {
      updateFields.password = await hash(password, 10);
    }
    return next();
  } catch (error) {
    updateFields.password = await hash(password, 10);
    return next();
  }
});
