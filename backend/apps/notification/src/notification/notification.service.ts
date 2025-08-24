import { Inject, Injectable } from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { Model } from 'mongoose';
import { ORDER_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,

    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientProxy,
  ) {}

  async sendPaymentNotification(data: SendPaymentNotificationDto) {
    const notification = await this.createNotifiction(data.to);

    await this.sendEmail();

    await this.updateNotificationStatus(
      notification._id.toString(),
      NotificationStatus.sent,
    );

    this.sendDeliveryStartedMessage(data.orderId);

    return this.notificationModel.findById(notification._id);
  }

  sendDeliveryStartedMessage(id: string) {
    this.orderMicroservice.emit(
      {
        cmd: 'delivery_started',
      },
      { id },
    );
  }

  async updateNotificationStatus(id: string, status: NotificationStatus) {
    return await this.notificationModel.findByIdAndUpdate(id, {
      status,
    });
  }

  async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async createNotifiction(to: string) {
    return this.notificationModel.create({
      from: 'test@gmail.com',
      to: to,
      subject: '배송이 시작됐습니다.',
      content: `${to}님! 주문하신 물건이 배송이 시작됐습니다!`,
    });
    //.save();
  }
}
