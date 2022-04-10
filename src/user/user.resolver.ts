import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserRoles } from '../auth/entities/user-roles';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GraphqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(GraphqlAuthGuard)
@UseGuards(RolesGuard)
@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Roles(UserRoles.ADMIN)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.showAll();
  }

  @Query(() => User)
  async user(@Args('email') email: string): Promise<User> {
    return await this.userService.getUser(email);
  }

  @Roles(UserRoles.ADMIN)
  @Mutation(() => User)
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

  @Roles(UserRoles.NORMAL)
  @Mutation(() => User)
  async update(
    @Args('user') user: UpdateUserInput,
    @CurrentUser() currentUser: any,
  ): Promise<User> {
    if (currentUser.userRole === UserRoles.NORMAL) {
      return await this.userService.update(
        currentUser._id,
        user,
        currentUser.userRole,
      );
    } else {
      throw new UnauthorizedException();
    }
  }
}
