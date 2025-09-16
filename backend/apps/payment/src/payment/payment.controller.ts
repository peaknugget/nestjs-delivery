import {
  Controller,
  Get,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GrpcInterceptor, RpcInterceptor } from '@app/common/interceptor';
import { MakePaymentDto } from './dto/make-payment.dto';
import { PaymentMicroservice } from '@app/common';
import { PaymentMethod } from './entity/payment.entity';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  // @MessagePattern({ cmd: 'make_payment' })
  // @UsePipes(new ValidationPipe())
  // @UseInterceptors(RpcInterceptor)
  async makePayment(
    request: PaymentMicroservice.MakePaymentRequest,
    metadata: Metadata,
  ) {
    console.log('🔖PaymentController  makePayment', request);

    return this.paymentService.makePayment(
      {
        ...request,
        paymentMethod: request.paymentMethod as PaymentMethod,
      },
      metadata,
    );
  }
}
