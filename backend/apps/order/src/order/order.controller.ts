import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(token: string, @Body() body): Promise<any> {
    //return this.orderService.createOrder();
  }
}
