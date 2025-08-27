import { UserPayloadDto } from '@app/common';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const userPayload = createParamDecorator<UserPayloadDto>(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const { user } = req;

    console.log(
      '🚀 ~ file: user-payload.decorator.ts ~ line 11 ~ userPayload ~ user',
      user,
    );

    if (!user) {
      throw new InternalServerErrorException('토큰 가드  오류?');
    }

    console.log('🚀🚀🚀🚀🚀 ~  🚀🚀🚀🚀🚀');
    return user;
  },
);
