import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Authorization = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    console.log('✅Authorization decorator called!!');

    return req.headers['authorization'];
  },
);
