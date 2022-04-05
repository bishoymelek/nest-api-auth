// import { Document } from 'mongoose';
import { UserRoles } from '../shared/user-roles';

// export interface User extends Document {
export interface User {
  id?: string;
  email: string;
  password: string;
  userRole?: UserRoles;
}
