import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE, PRODUCT_SERVICE, USER_SERVICE } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { BearerTokenMiddleware } from './auth/middleware/bearer-token.middleware';

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
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: 'user_queue',
              queueOptions: {
                durable: true,
              },
            },
          }),
          inject: [ConfigService],
        },

        {
          name: PRODUCT_SERVICE, // ✅ 추가
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: 'product_queue',
              queueOptions: {
                durable: true,
              },
            },
          }),
          inject: [ConfigService],
        },

        {
          name: ORDER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: 'order_queue',
              queueOptions: {
                durable: true,
              },
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
