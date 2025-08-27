import { USER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { last, lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientProxy,
  ) {}

  register(token: string, registerDto: RegisterDto) {
    console.log(' *** gateway registerUser token  :  lastValueFrom:', token);

    return lastValueFrom(
      this.userMicroservice.send(
        { cmd: 'register' },
        { ...registerDto, token },
      ),
    );
  }

  login(token: string) {
    return lastValueFrom(
      this.userMicroservice.send({ cmd: 'login' }, { token }),
    );
  }
}
