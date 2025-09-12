import { Controller, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderMicroservice, RpcInterceptor } from '@app/common';
import { DeliveryStartedDto } from './dto/delivery-started.dto';
import { Order, OrderStatus } from './entity/order.entity';
import { Payment, PaymentMethod } from './entity/payment.entity';

//pnpm i @nestjs/microservices
@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(private readonly orderService: OrderService) {}

  // @EventPattern({ cmd: 'delivery_started' })
  // @UseInterceptors(RpcInterceptor)
  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    console.log('deliveryStartedDto', request);

    this.orderService.changeOrderStatus(
      request.id,
      OrderStatus.deliveryStarted,
    );
  }

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(request: OrderMicroservice.CreateOrderRequest) {
    console.log('2.microService OrderController createOrder   token:', request);
    return this.orderService.createOrder({
      ...request,
      payment: {
        ...request.payment,
        paymentMethod: request.payment.paymentMethod as PaymentMethod,
      },
    });
  }
}
