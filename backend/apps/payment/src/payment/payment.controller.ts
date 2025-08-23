import {
  Controller,
  Get,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common/interceptor';
import { MakePaymentDto } from './dto/make-payment.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'make_payment' })
  @UsePipes(new ValidationPipe())
  @UseInterceptors(RpcInterceptor)
  async makePayment(@Payload() payload: MakePaymentDto) {
    return this.paymentService.makePayment(payload);
  }
}
