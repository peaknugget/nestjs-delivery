import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';
import { NOTIFICATION_SERVICE, NotificationMicroservice } from '@app/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService implements OnModuleInit {
  notificationService: NotificationMicroservice.NotificationServiceClient;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    // @Inject(NOTIFICATION_SERVICE)
    // private readonly notificationService: ClientProxy,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    // 마이크로서비스에서 notificationService를 가져옵니다.
    this.notificationService =
      this.notificationMicroservice.getService<NotificationMicroservice.NotificationServiceClient>(
        'NotificationService',
      );
  }

  async makePayment(payload: MakePaymentDto) {
    let paymentId = null;
    try {
      const result = await this.paymentRepository.save(payload);

      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(result.id, PaymentStatus.approved);

      //Notification 보내기
      console.log('✅  Notification 보내기 : ');
      this.sendNotification(payload.orderId, payload.userEmail);

      return this.paymentRepository.findOneBy({ id: result.id });
    } catch (e) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.rejected);
      }

      throw e;
    }
  }

  async processPayment() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    await this.paymentRepository.update(
      {
        id,
      },
      {
        paymentStatus: status,
      },
    );
  }

  async sendNotification(orderId: string, to: string) {
    // const resp = await lastValueFrom(
    //   this.notificationService.send(
    //     { cmd: 'send_payment_notification' },
    //     { to, orderId },
    //   ),
    // );

    // GRPC 통신
    const resp = await lastValueFrom(
      this.notificationService.sendPaymentNotification({ to, orderId }),
    );
    console.log('✅  sendNotification resp : ', resp);
  }
}
