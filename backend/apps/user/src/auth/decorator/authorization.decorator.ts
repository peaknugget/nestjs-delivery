import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Authorization = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    console.log('✅Authorization decorator called!!');

    return req.headers['authorization'];
  },
);

export const Authorization2 = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    if (type !== 'Basic' || !token) return null;

    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    return { username, password };
  },
);
