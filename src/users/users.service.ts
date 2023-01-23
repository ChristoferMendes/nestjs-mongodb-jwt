import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';
import { User } from './models/users.models';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async signUp(signUpDTO: SignUpDTO) {
    const user = new this.usersModel(signUpDTO);
    return user.save();
  }

  public async signIn(signInDTO: SignInDTO) {
    const user = await this._findByEmail(signInDTO.email);
    await this._checkPassword(signInDTO.password, user);

    const jwtToken = this.authService.createAccessToken(user.id);

    return {
      name: user.name,
      email: user.email,
      jwtToken,
    };
  }

  public findAll() {
    return this.usersModel.find();
  }

  private async _findByEmail(email: string) {
    const user = await this.usersModel.findOne({ email });
    if (!user) throw new NotFoundException('Email not found');

    return user;
  }

  private async _checkPassword(password: string, user: User) {
    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new NotFoundException('Wrong password');

    return match;
  }
}
