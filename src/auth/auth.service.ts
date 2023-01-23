import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from 'src/users/models/users.models';
import { JwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly usersModel: Model<User>) {}

  public createAccessToken(userId: string) {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  public validateUser(jwtPayload: JwtPayload) {
    const { userId } = jwtPayload;
    const user = this.usersModel.findOne({ _id: userId });

    if (!user) throw new UnauthorizedException('User not found.');

    return user;
  }

  private static jwtExtractor(request: Request) {
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new BadRequestException('Bad request.');

    const [, token] = authHeader.split(' ');
    return token;
  }

  public returnJwtExtractor(): (req: Request) => string {
    return AuthService.jwtExtractor;
  }
}
