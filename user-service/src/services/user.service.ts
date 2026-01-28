import { REFRESH_TOKEN_TTL_MS } from '../common/constants';
import { UnauthenticatedException } from '../common/exceptions';
import type {
  UserLoginRequest,
  UserPublic,
  UserRegisterRequest,
  UserStored,
} from '../common/types/user.type';
import { UserSchema } from '../common/validations';
import { Argon2PasswordManager } from '../infrastructures/security';
import { JWTManager } from '../infrastructures/security/token-manager';
import { RefreshTokenRepository, UserRepository } from '../repositories';

export class UserService {
  public static async register(
    registerRequest: UserRegisterRequest,
  ): Promise<UserPublic> {
    const userRegister = UserSchema.register.parse(registerRequest);

    const hashedPassword = await Argon2PasswordManager.hash(
      userRegister.password,
    );

    userRegister['password'] = hashedPassword;

    const user = await UserRepository.register(userRegister);

    return UserService.map(user);
  }

  public static async login(loginRequest: UserLoginRequest): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userLogin = UserSchema.login.parse(loginRequest);

    const user = await UserRepository.selectUserByUsername(userLogin.username);

    if (!user) {
      throw new UnauthenticatedException('Username or Password wrong');
    }

    const isVerified = await Argon2PasswordManager.verify(
      user.password,
      userLogin.password,
    );

    if (!isVerified) {
      throw new UnauthenticatedException('Username or Password wrong');
    }

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    const accessToken = JWTManager.signAccessToken({
      sub: user._id.toString(),
    });
    const refreshToken = JWTManager.signRefreshToken({
      sub: user._id.toString(),
    });

    await RefreshTokenRepository.store({
      token: refreshToken,
      user: user._id,
      expiresAt,
    });

    console.log(JWTManager.verifyAccessToken(accessToken));
    console.log('refresh', JWTManager.verifyRefreshToken(refreshToken));

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async getUsers(): Promise<UserPublic[]> {
    const users = await UserRepository.selectUsers();

    return users.map((user) => UserService.map(user));
  }

  private static map(data: UserStored): UserPublic {
    return {
      id: data._id.toString(),
      name: data.name,
      username: data.username,
      email: data.email,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
