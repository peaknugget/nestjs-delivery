import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TokenGuard } from '../auth/guard/token.guard';
import { UserPayloadDto } from '@app/common';
import { userPayload } from '../auth/decorator/user-payload.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(TokenGuard)
  async createOrder(
    @userPayload()
    userPayload: UserPayloadDto,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    console.log('1.gateway createOrderDto   userPayload:', userPayload);
    console.log('2.gateway createOrderDto   token:', createOrderDto);

    return this.orderService.createOrder(createOrderDto, userPayload);
  }
}
