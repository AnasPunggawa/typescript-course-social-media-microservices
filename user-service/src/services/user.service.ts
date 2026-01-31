import { Types } from 'mongoose';
import { REFRESH_TOKEN_TTL_MS } from '../common/constants';
import {
  NotFoundException,
  UnauthenticatedException,
} from '../common/exceptions';
import { Tokens } from '../common/types/refresh-token.type';
import type {
  UserLoginRequest,
  UserLoginResponse,
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
  ): Promise<{ user: UserPublic; tokens: UserLoginResponse }> {
    const userRegister = UserSchema.register.parse(registerRequest);

    const hashedPassword = await Argon2PasswordManager.hash(
      userRegister.password,
    );

    userRegister['password'] = hashedPassword;

    const user = await UserRepository.register(userRegister);

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    const { accessToken, refreshToken } = UserService.signTokens(user);

    await RefreshTokenRepository.store({
      token: refreshToken,
      user: user._id,
      expiresAt,
    });

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

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    const { accessToken, refreshToken } = UserService.signTokens(user);

    await RefreshTokenRepository.store({
      token: refreshToken,
      user: user._id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public static async reissueAccessToken(
    refreshToken: string | undefined,
  ): Promise<string> {
    if (!refreshToken) {
      throw new UnauthenticatedException('Refresh token is required');
    }

    const verifiedToken = JWTManager.verifyRefreshToken(refreshToken);

    const refreshTokenData =
      await RefreshTokenRepository.selectTokenByTokenAndUserId({
        token: refreshToken,
        user: UserService.toMongooseObjectId(verifiedToken.sub),
      });

    if (!refreshTokenData) {
      throw new UnauthenticatedException('Refresh token revoked');
    }

    return JWTManager.signAccessToken({
      sub: refreshTokenData.user.toString(),
    });
  }

  public static async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      throw new UnauthenticatedException('Refresh token is required');
    }

    const verifiedToken = JWTManager.verifyRefreshToken(refreshToken);

    const deleteResult =
      await RefreshTokenRepository.deleteTokenByTokenAndUserId({
        token: refreshToken,
        user: UserService.toMongooseObjectId(verifiedToken.sub),
      });

    if (deleteResult.deletedCount === 0) {
      throw new NotFoundException('Refresh token not found or already revoked');
    }
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

  private static toMongooseObjectId(id: string | undefined): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  private static signTokens(user: UserStored): Tokens {
    const accessToken = JWTManager.signAccessToken({
      sub: user._id.toString(),
    });

    const refreshToken = JWTManager.signRefreshToken({
      sub: user._id.toString(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
