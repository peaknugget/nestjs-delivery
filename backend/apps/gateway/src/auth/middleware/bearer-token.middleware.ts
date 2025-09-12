import { USER_SERVICE, UserMicroservice } from '@app/common';
import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
  authService: UserMicroservice.AuthServiceClient;

  constructor(
    // @Inject(USER_SERVICE)
    // private readonly userMicroservice: ClientProxy,

    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroservice.getService<UserMicroservice.AuthServiceClient>(
        'AuthService',
      );
  }

  async use(req: any, res: any, next: (error?: any) => void) {
    /// 1) Raw 토큰 가져오기
    const token = this.getRawToken(req);

    if (!token) {
      next();
      return;
    }

    /// 2) User Auth에 토큰 던지기
    const payload = await this.verifyToken(token);

    /// 3) req.user payload 붙이기
    req.user = payload;
    next();
  }

  getRawToken(req: any): string | null {
    const authHeader = req.headers['authorization'];
    return authHeader;
  }

  async verifyToken(token: string) {
    // const result = await lastValueFrom(
    //   this.userMicroservice.send({ cmd: 'parse_bearer_token' }, { token }),
    // );
    // if (result.status === 'error') {
    //   throw new UnauthorizedException('토큰 정보가 잘못됐습니다!');
    // }
    // return result.data;

    const result = await lastValueFrom(
      this.authService.parseBearerToken({ token }),
    );
    return result;
  }
}
