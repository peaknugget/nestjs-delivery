import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.TCP_PORT) || 4001, // TCP는 별도 포트
    },
  });

  await app.startAllMicroservices();

  const port = process.env.HTTP_PORT ?? 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`✅🎈 Server is running on http://localhost:${port}`);
}
bootstrap();
