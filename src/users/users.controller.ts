import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signUp(@Body() signUpDTO: SignUpDTO) {
    return await this.usersService.signUp(signUpDTO);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() SignInDTO: SignInDTO) {
    return await this.usersService.signIn(SignInDTO);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  public findAll() {
    return this.usersService.findAll();
  }
}
