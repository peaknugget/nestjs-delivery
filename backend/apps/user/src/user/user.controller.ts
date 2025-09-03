import {
  Controller,
  Get,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common/interceptor';
import { UserMicroservice } from '@app/common';

@Controller()
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) {}

  // @MessagePattern({ cmd: 'get_user_info' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  getUserInfo(data: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(data.userId);
  }
}
