import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../types/user';
import { UserType } from './entities/user.entity';
import { UserRoles } from '../shared/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GraphqlAuthGuard } from '../auth/guards/gql-auth.guard';
// import { Roles } from '../decorators/roles.decorator';

@UseGuards(GraphqlAuthGuard)
@UseGuards(RolesGuard)
@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  // @Roles("Admin")
  @Query((returns) => [UserType])
  async users(): Promise<User[]> {
    return await this.userService.showAll();
  }

  @Query((returns) => UserType)
  async user(@Args('email') email: string): Promise<User> {
    return await this.userService.getUser(email);
  }

  @Mutation((returns) => UserType)
  async delete(
    @Args('email') email: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    // TODO: check if user is admin or has proper permissions
    if (email === user.email) {
      return await this.userService.deleteUserByEmail(email);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation((returns) => UserType)
  async update(
    @Args('id') id: string,
    @Args('user') user: UpdateUserInput,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    if (id === currentUser.id || currentUser.userRole === UserRoles.ADMIN) {
      return await this.userService.update(id, user, currentUser.userRole);
    } else {
      throw new UnauthorizedException();
    }
  }
}
