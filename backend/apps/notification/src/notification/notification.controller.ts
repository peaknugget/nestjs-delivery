import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationMicroservice, RpcInterceptor } from '@app/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';

@Controller()
export class NotificationController
  implements NotificationMicroservice.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  // @MessagePattern({ cmd: 'send_payment_notification' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  async sendPaymentNotification(
    request: NotificationMicroservice.SendPaymentNotificationRequest,
  ) {
    console.log('✔️ NotificationController sendPaymentNotification', request);
    const resp = (
      await this.notificationService.sendPaymentNotification(request)
    ).toJSON();

    return { ...resp, status: resp.status.toString() };
  }
}
