import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';
if (!globalThis.crypto) {
  // node 환경에 전역 crypto 객체 수동 주입
  globalThis.crypto = crypto as any;
}
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    randomUUID,
  } as any;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.HTTP_PORT ?? 3001);
}
bootstrap();
