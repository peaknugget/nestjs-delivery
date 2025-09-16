import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  constructMetadata,
  PAYMENT_SERVICE,
  PaymentMicroservice,
  PRODUCT_SERVICE,
  ProductMicroservice,
  USER_SERVICE,
  UserMicroservice,
} from '@app/common';
import { PaymentCancelledException } from './exception/payment-cancelled.exception';
import { Product } from './entity/product.entity';
import { Customer } from './entity/customer.entity';
import { AddressDto } from './dto/address.dto';
import { Order, OrderStatus } from './entity/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDto } from './dto/payment.dto';
import { PaymentFailedException } from './exception/payment-failed.exception';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class OrderService implements OnModuleInit {
  userService: UserMicroservice.UserServiceClient;
  productService: ProductMicroservice.ProductServiceClient;
  paymentService: PaymentMicroservice.PaymentServiceClient;

  constructor(
    // @Inject(USER_SERVICE) private readonly userService: ClientProxy,
    // @Inject(PRODUCT_SERVICE) private readonly productService: ClientProxy,
    // @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy,

    @Inject(USER_SERVICE) private readonly userMicroService: ClientGrpc,
    @Inject(PRODUCT_SERVICE) private readonly productMicroService: ClientGrpc,
    @Inject(PAYMENT_SERVICE) private readonly paymentMicroService: ClientGrpc,

    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroService.getService<UserMicroservice.UserServiceClient>(
        'UserService',
      );
    this.productService =
      this.productMicroService.getService<ProductMicroservice.ProductServiceClient>(
        'ProductService',
      );
    this.paymentService =
      this.paymentMicroService.getService<PaymentMicroservice.PaymentServiceClient>(
        'PaymentService',
      );
  }

  async createOrder(createOrderDto: CreateOrderDto, metadata: Metadata) {
    const { productIds, address, payment, meta } = createOrderDto;

    /// 1) 사용자 정보 가져오기
    console.log(
      '=====================================================사용자 정보 가져오기',
    );
    console.log(
      'productIds :',
      productIds,
      ' ,  address :',
      address,
      ' ,  payment :',
      payment,
    );

    const user = await this.getUserFromToken(meta.user.sub, metadata);

    /// 2) 상품 정보 가져오기
    const products = await this.getProductsByIds(productIds, metadata);

    /// 3) 총 금액 계산하기
    const totalAmount = this.calculateTotalAmount(products, metadata);

    /// 4) 금액 검증하기 - total 이 맞는지 (프론트에서 보내준 데이터량)
    this.validatePaymentAmount(totalAmount, payment.amount);

    /// 5) 주문 생성하기 - 데이터베이스에 넣기
    console.log('🎈🎈🎈🎈🎈🎈🎈🎈 5-1)주문 생성하기  🎈🎈🎈🎈🎈🎈🎈 ');
    const customer = this.createCustomer(user);
    console.log(
      '🎈🎈🎈🎈🎈🎈🎈🎈 5-2)주문 생성하기  🎈🎈🎈🎈🎈🎈🎈 ',
      customer,
    );
    const order = await this.createNewOrder(
      customer,
      products,
      address,
      payment,
    );

    ////6) 결제 시도하기
    console.log('🎈🎈🎈🎈🎈🎈🎈🎈 6) 결제 시도하기 🎈🎈🎈🎈🎈🎈🎈 ');
    const processPayment = await this.processPayment(
      order._id.toString(),
      payment,
      user.email,
      metadata,
    );

    console.log('🎈🎈🎈🎈🎈🎈🎈🎈 결과 반환하기 🎈🎈🎈🎈🎈🎈🎈 ');
    /// 7) 결과 반환하기
    return this.orderModel.findById(order._id);
  }

  private async getUserFromToken(userId: string, metadata: Metadata) {
    // 1) User MS : JWT 토큰 검증
    // const resp = await lastValueFrom(
    //   this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    // );

    // if (resp.status === 'error') {
    //   throw new PaymentCancelledException(resp);
    // }

    console.log('=====================================================');
    //console.log('resp', resp);

    // 2) User MS : 사용자 정보 가져오기
    //const userId = resp.data.sub;

    // const uResp = await lastValueFrom(
    //   this.userService.send({ cmd: 'get_user_info' }, { userId }),
    // );

    // if (uResp.status === 'error') {
    //   throw new PaymentCancelledException(uResp);
    // }

    const uResp = await lastValueFrom(
      this.userService.getUserInfo(
        { userId },
        constructMetadata(OrderService.name, 'getUserFromToken', metadata),
      ),
    );
    return uResp;
  }

  private async getProductsByIds(
    productIds: string[],
    metadata: Metadata,
  ): Promise<Product[]> {
    // const resp = await lastValueFrom(
    //   this.productService.send({ cmd: 'get_products_info' }, { productIds }),
    // );

    // if (resp.status === 'error') {
    //   throw new PaymentCancelledException('상품 정보가 잘못됐습니다.!');
    // }

    // Product 엔티티로 전환
    // return resp.data.map((product) => {
    //   return {
    //     productId: product.id,
    //     name: product.name,
    //     price: product.price,
    //   };
    // });

    const resp = await lastValueFrom(
      this.productService.getProductsInfo(
        { productIds },
        constructMetadata(OrderService.name, 'getProductsByIds', metadata),
      ),
    );
    return resp.products.map((product) => {
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
      };
    });
  }

  private calculateTotalAmount(products: Product[], metadata: Metadata) {
    return products.reduce((total, product) => total + product.price, 0);
  }

  private validatePaymentAmount(totalA: number, totalB: number) {
    console.log('totalA : ', totalA, ' , totalB : ', totalB);
    if (totalA !== totalB) {
      throw new PaymentCancelledException('결제하려는 금액이 변경됐습니다!');
    }
  }

  private createCustomer(user: { id: string; email: string; name: string }) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto,
  ) {
    return this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    });
  }

  async processPayment(
    orderId: string,
    payment: PaymentDto,
    userEmail: string,
    metadata: Metadata,
  ) {
    try {
      console.log('🔖payment 에 메시지 전송 :시작 ');
      // const resp = await lastValueFrom(
      //   this.paymentService.send(
      //     { cmd: 'make_payment' },
      //     { ...payment, userEmail, orderId },
      //   ),
      // );

      // console.log('🔖payment 에 메시지 전송 :끝  ');

      // const isPaid = resp.data.paymentStatus === 'Approved';
      // const orderStatus = isPaid
      //   ? OrderStatus.paymentProcessed
      //   : OrderStatus.paymentFailed;

      // if (orderStatus === OrderStatus.paymentFailed) {
      //   throw new PaymentFailedException(resp.error);
      // }

      const resp = await lastValueFrom(
        this.paymentService.makePayment(
          { ...payment, userEmail, orderId },
          constructMetadata(OrderService.name, 'processPayment', metadata),
        ),
      );

      const isPaid = resp.paymentStatus === 'Approved';
      const orderStatus = isPaid
        ? OrderStatus.paymentProcessed
        : OrderStatus.paymentFailed;

      if (orderStatus === OrderStatus.paymentFailed) {
        throw new PaymentFailedException(resp);
      }

      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.paymentProcessed,
      });

      return resp;
    } catch (e) {
      console.log('🤬 processPayment  에러: ', e);

      if (e instanceof PaymentFailedException) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          status: OrderStatus.paymentFailed,
        });
      }
      throw e;
    }
  }

  changeOrderStatus(orderId: string, status: OrderStatus) {
    return this.orderModel.findByIdAndUpdate(orderId, { status });
  }
}
