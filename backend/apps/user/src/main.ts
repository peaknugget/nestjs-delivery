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
  const port = process.env.HTTP_PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`✅🎈 Server is running on http://localhost:${port}`);
}
bootstrap();
