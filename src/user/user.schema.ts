import { Document } from 'mongoose';
import { getRounds, hash } from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  userRole: string;
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
