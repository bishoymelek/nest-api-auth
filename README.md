# NestJS + GraphQL + MongoDB + PassportJS Boilerplate

 
  ## How Authentication and Authorization work

 - We have Auth and User modules handling all work for users and auth.

 - First, we have both modules in `imports` in the `app.module.ts`

 - In Auth Module, `auth/auth.module.ts`, We are using `PassportModule` and defining the default strategy as JWT, in the `imports` attributes.

 - Then we import `auth/strategy/jwt.strategy` where we extend `PassportStrategy` Class as `JwtStrategy`; And add it to `providers` array.

 - In the `JwtStrategy`:

    - In the constructor, we handle extracting the jwt from the requests; using `passport-jwt` package.

    - As well as defining the secret key, `SECRET_KEY`, which is very important in the production.

    - In the `validate` method, we get the payload of the token, with the user email, we check if the user exists.


### Login

- In `auth/auth.resolver`, We check the user by the email, in the `user/users.service.ts`:

    - If not found, we throw error that user doesn't exist.

    - If found, we compare the saved password with the user input, using `bcrypt` module; if correct, we return the user, if not, we throw error of wrong password.


### Register

- In `auth/auth.resolver`
    - We check the user by the email, in the `user/users.service.ts`
    
    - if found, we throw error that user exists.

    - If not found, create user and return it.

        - Then, back in the auth resolver, sign token with defined payload, from the `auth/auth.service` where we use `jsonwebtoken` module. And we use the SECRET_KEY env variable and define the `expiryDate`.


## Guards

- `auth/guards/gql-auth-guard`, We define `GraphqlAuthGuard` which is extending `AuthGuard` from the `@nestjs/passport`

    - `getRequest` method, gets the request, and create request graphQL context `GqlExecutionContext` and return it.

    - `handleRequest` method, will get `err, user, info` parameters. If there is error or user not found, return 

