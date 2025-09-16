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
import { GrpcInterceptor, RpcInterceptor } from '@app/common/interceptor';
import { LoginDto } from './dto/login.dto';
import { UserMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';

@Controller('auth')
@UserMicroservice.AuthServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class AuthController implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  // @MessagePattern({
  //   cmd: 'parse_bearer_token',
  // })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  parseBearerToken(request: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(request.token, false);
  }

  // @MessagePattern({
  //   cmd: 'register',
  // })
  registerUser(request: UserMicroservice.RegisterUserRequest) {
    console.log(' * microService user registerUser  token:', request.token);

    const { token } = request;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!!!');
    }

    return this.authService.register(token, request);
  }

  // @MessagePattern({
  //   cmd: 'login',
  // })
  loginUser(request: UserMicroservice.LoginUserRequest, metadata: Metadata) {
    console.log('로그인 시도 !!:', request);
    console.log('✅ Metadata !!:', metadata);

    const { token } = request;

    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.login(token);
  }
}
