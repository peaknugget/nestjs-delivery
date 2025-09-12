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
import { User } from './entity/user.entity';

@Controller()
@UserMicroservice.UserServiceControllerMethods()
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) {}

  // @MessagePattern({ cmd: 'get_user_info' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  getUserInfo(request: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(request.userId);
  }
}
