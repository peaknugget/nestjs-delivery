import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
//import { Authorization } from 'apps/user/src/auth/decorator/authorization.decorator';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common';
import { DeliveryStartedDto } from './dto/delivery-started.dto';
import { OrderStatus } from './entity/order.entity';
import { Authorization } from '@app/common/decorator/authorization.decorator';

//pnpm i @nestjs/microservices
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Authorization()
    token: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    // console.log('1.createOrderDto   token:', createOrderDto);
    // console.log('2.createOrderDto   CreateOrderDto:', createOrderDto);
    return this.orderService.createOrder(createOrderDto, token);
  }

  @EventPattern({ cmd: 'delivery_started' })
  @UseInterceptors(RpcInterceptor)
  async deliveryStarted(@Payload() payload: DeliveryStartedDto) {
    console.log('deliveryStartedDto', payload);

    this.orderService.changeOrderStatus(
      payload.id,
      OrderStatus.deliveryStarted,
    );
  }
}
