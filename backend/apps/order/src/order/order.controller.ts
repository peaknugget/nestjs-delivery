import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getHello(): string {
    console.log('💐order');
    return this.orderService.getHello();
  }
}
