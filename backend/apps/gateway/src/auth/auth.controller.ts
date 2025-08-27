import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authorization } from './decorator/authorization.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 
    엔코딩 명령어 

   */
  //powershell -command "[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('test222@gmail.com:1111'))"

  @Post('register')
  registerUser(
    @Authorization() token: string,
    @Body() registerDto: RegisterDto,
  ) {
    console.log(' * gateway registerUser token:', token);
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!!!');
    }
    return this.authService.register(token, registerDto);
  }

  @Post('login')
  loginUser(@Authorization() token: string) {
    console.log('로그인 시도 !!:', token);

    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.login(token);
  }
}
