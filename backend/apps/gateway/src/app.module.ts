import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ORDER_SERVICE,
  OrderMicroservice,
  PRODUCT_SERVICE,
  ProductMicroservice,
  USER_SERVICE,
  UserMicroservice,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { BearerTokenMiddleware } from './auth/middleware/bearer-token.middleware';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),

        USER_HOST: Joi.string().required(), // ✅ 추가
        USER_TCP_PORT: Joi.number().required(), // ✅ 추가

        PRODUCT_HOST: Joi.string().required(), // ✅ 추가
        PRODUCT_TCP_PORT: Joi.number().required(), // ✅ 추가

        ORDER_HOST: Joi.string().required(), // ✅ 추가
        ORDER_TCP_PORT: Joi.number().required(), // ✅ 추가
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: USER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: UserMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/user.proto'),
              url: configService.getOrThrow('USER_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },

        {
          name: PRODUCT_SERVICE, // ✅ 추가
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: ProductMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/product.proto'),
              url: configService.getOrThrow('PRODUCT_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },

        {
          name: ORDER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: OrderMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/order.proto'),
              url: configService.getOrThrow('ORDER_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),

    OrderModule,
    ProductModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BearerTokenMiddleware).forRoutes('order');
  }
}
