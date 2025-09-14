import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserMicroservice } from '@app/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

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
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: UserMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto', 'user.proto'),
      url: configService.getOrThrow('GRPC_URL'),
    },
  });

  await app.init();

  await app.startAllMicroservices();
}
bootstrap();
