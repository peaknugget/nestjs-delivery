import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { NotificationMicroservice } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: NotificationMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/notification.proto'),
      url: configService.getOrThrow('NOTIFICATION_GRPC_URL'),
    },
  });

  await app.init();

  await app.startAllMicroservices();

  //await app.listen(process.env.HTTP_PORT ?? 3005);
}
bootstrap();
