import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
//import { Authorization } from 'apps/user/src/auth/decorator/authorization.decorator';

//pnpm i @nestjs/microservices
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(token: string, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto, token);
  }
}
