import { Controller, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common';
import { DeliveryStartedDto } from './dto/delivery-started.dto';
import { OrderStatus } from './entity/order.entity';

//pnpm i @nestjs/microservices
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern({ cmd: 'delivery_started' })
  @UseInterceptors(RpcInterceptor)
  async deliveryStarted(@Payload() payload: DeliveryStartedDto) {
    console.log('deliveryStartedDto', payload);

    this.orderService.changeOrderStatus(
      payload.id,
      OrderStatus.deliveryStarted,
    );
  }

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(@Payload() createOrderDto: CreateOrderDto) {
    console.log(
      '2.microService OrderController createOrder   token:',
      createOrderDto,
    );
    return this.orderService.createOrder(createOrderDto);
  }
}
