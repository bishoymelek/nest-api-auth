import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserArgs } from './dto/login.dto';
import { TokenPayload } from './dto/token-payload.dto';
import { AuthType } from './entities/auth.entity';
import { UserRoles } from './entities/user-roles';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { CreateUserArgs } from '../user/dto/create-user.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => AuthType)
  async register(@Args('RegisterUserInput') args: CreateUserArgs) {
    const { email, password } = args;

    const user: User = { email, password, userRole: UserRoles.NORMAL };
    try {
      const response: User = await this.userService.create(user);
      const tokenPayload: TokenPayload = {
        email: response.email,
        role: response.userRole,
      };

      const token = await this.authService.signPayload(tokenPayload);
      return { email: response.email, token };
    } catch (exception) {
      throw exception;
    }
  }

  @Mutation(() => AuthType)
  async login(@Args('LoginUserInput') args: LoginUserArgs) {
    const { email, password } = args;

    const response: User = await this.userService.findByLogin({
      email,
      password,
    });

    const tokenPayload: TokenPayload = {
      email: response.email,
      role: response.userRole,
    };

    const token = await this.authService.signPayload(tokenPayload);

    return { email: response.email, token };
  }
}
