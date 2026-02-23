import { Types } from 'mongoose';

import { REFRESH_TOKEN_TTL_MS } from '@common/constants/token.constant';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { UnauthenticatedException } from '@common/exceptions/unauthenticated.exception';
import type { SignTokenParams, Tokens } from '@common/types/refresh-token.type';
import type {
  ReissueTokensResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserPublic,
  UserRegisterRequest,
  UserStored,
} from '@common/types/user.type';
import { UserSchema } from '@common/validations/user.schema';
import { Argon2PasswordManager, JWTManager } from '@infrastructures/security';
import { RefreshTokenRepository } from '@repositories/refresh-token.repository';
import { UserRepository } from '@repositories/user.repository';

export class UserService {
  public static async register(
    registerRequest: UserRegisterRequest,
  ): Promise<{ user: UserPublic; tokens: UserLoginResponse }> {
    const userRegister = UserSchema.register.parse(registerRequest);

    const hashedPassword = await Argon2PasswordManager.hash(
      userRegister.password,
    );

    userRegister['password'] = hashedPassword;

    const user = await UserRepository.register(userRegister);

    const { accessToken, refreshToken } = UserService.signTokens({
      userId: user._id,
    });

    await UserService.storeToken(refreshToken, user._id);

    return {
      user: UserService.map(user),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  public static async login(
    loginRequest: UserLoginRequest,
  ): Promise<UserLoginResponse> {
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

    const { accessToken, refreshToken } = UserService.signTokens({
      userId: user._id,
    });

    await UserService.storeToken(refreshToken, user._id);

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async reissueAccessToken(
    token: string | undefined,
  ): Promise<ReissueTokensResponse> {
    if (!token) {
      throw new UnauthenticatedException('Refresh token is required');
    }

    const hashedToken = JWTManager.hashRefreshToken(token);

    const refreshTokenData =
      await RefreshTokenRepository.selectToken(hashedToken);

    if (!refreshTokenData) {
      throw new UnauthenticatedException('Refresh token revoked');
    }

    UserService.isValidToken(refreshTokenData.token, token);

    await RefreshTokenRepository.deleteToken(hashedToken);

    const { accessToken, refreshToken } = UserService.signTokens({
      userId: refreshTokenData.user,
    });

    await UserService.storeToken(refreshToken, refreshTokenData.user);

    return { accessToken, refreshToken };
  }

  public static async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const hashedToken = JWTManager.hashRefreshToken(refreshToken);

    await RefreshTokenRepository.deleteToken(hashedToken);
  }

  public static async getUsers(): Promise<UserPublic[]> {
    const users = await UserRepository.selectUsers();

    return users.map((user) => UserService.map(user));
  }

  public static async getCurrent(id: string | undefined): Promise<UserPublic> {
    const userId = UserSchema.id.parse(id);

    const user = await UserRepository.selectUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserService.map(user);
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

  private static signTokens({ userId }: SignTokenParams): Tokens {
    const accessToken = JWTManager.signAccessToken({
      sub: userId.toString(),
    });

    const refreshToken = JWTManager.signRefreshToken();

    return {
      accessToken,
      refreshToken,
    };
  }

  private static async storeToken(
    token: string,
    userId: Types.ObjectId,
  ): Promise<void> {
    await RefreshTokenRepository.store({
      token: JWTManager.hashRefreshToken(token),
      user: userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });
  }

  private static isValidToken(hashedToken: string, token: string): void {
    const isValid = JWTManager.verifyRefreshToken(hashedToken, token);

    if (!isValid) {
      throw new UnauthenticatedException('Invalid refresh token');
    }
  }
}
