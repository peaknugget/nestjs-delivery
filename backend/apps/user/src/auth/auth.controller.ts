import {
  Controller,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseBearerTokenDto } from './dto/parse-bearer-token.dto';
import { RpcInterceptor } from '@app/common/interceptor';
import { LoginDto } from './dto/login.dto';
import { UserMicroservice } from '@app/common';

@Controller('auth')
export class AuthControlle implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  // @MessagePattern({
  //   cmd: 'parse_bearer_token',
  // })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  parseBearerToken(payload: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(payload.token, false);
  }

  // @MessagePattern({
  //   cmd: 'register',
  // })
  registerUser(registerDto: UserMicroservice.RegisterUserRequest) {
    console.log(' * microService user registerUser  token:', registerDto.token);

    const { token } = registerDto;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!!!');
    }

    return this.authService.register(token, registerDto);
  }

  // @MessagePattern({
  //   cmd: 'login',
  // })
  loginUser(loginDto: UserMicroservice.LoginUserRequest) {
    console.log('로그인 시도 !!:', loginDto);
    const { token } = loginDto;

    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.login(token);
  }
}
