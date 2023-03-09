import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SigninInput } from './dto/inputs';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(userInfo: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(userInfo);

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }
  async login(userInfo: SigninInput): Promise<AuthResponse> {
    const { email, password } = userInfo;

    const user = await this.usersService.findOneByEmail(userInfo.email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException("Email/Password don't match");
    }
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  revalidateToken(userInfo: User): AuthResponse {
    const token = this.getJwtToken(userInfo.id);
    return { token, user: userInfo };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive)
      throw new UnauthorizedException(
        `User is inactive, please talk with your admin`,
      );

    delete user.password;
    return user;
  }
}
