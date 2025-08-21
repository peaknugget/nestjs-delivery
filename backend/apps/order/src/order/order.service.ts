import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PRODUCT_SERVICE, USER_SERVICE } from '@app/common';
import { PaymentCancelledException } from './exception/payment-cancelled.exception';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy,
    @Inject(PRODUCT_SERVICE) private readonly productServiceClient: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    const { productIds, address, payment } = createOrderDto;

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

    const user = await this.getUserFromToken(token);

    /// 2) 상품 정보 가져오기
    const products = await this.getProductsByIds(productIds);

    /// 3) 총 금액 계산하기
    /// 4) 금액 검증하기 - total 이 맞는지 (프론트에서 보내준 데이터량)
    /// 5) 주문 생성하기 - 데이터베이스에 넣기
    ////6) 결제 시도하기
    /// 7) 주문 상태 업데이트하기
    /// 8) 결과 반환하기
  }

  async getUserFromToken(token: string) {
    // 1) User MS : JWT 토큰 검증
    const resp = await lastValueFrom(
      this.userServiceClient.send({ cmd: 'parse_bearer_token' }, { token }),
    );

    if (resp.status === 'error') {
      throw new PaymentCancelledException(resp);
    }

    console.log('=====================================================');
    console.log('resp', resp);

    // 2) User MS : 사용자 정보 가져오기
    const userId = resp.data.sub;
    const uResp = await lastValueFrom(
      this.userServiceClient.send({ cmd: 'get_user_info' }, { userId }),
    );

    if (uResp.status === 'error') {
      throw new PaymentCancelledException(uResp);
    }

    return uResp.data;
  }

  async getProductsByIds(productIds: string[]) {
    const resp = await lastValueFrom(
      this.productServiceClient.send(
        { cmd: 'get_products_info' },
        { productIds },
      ),
    );

    if (resp.status === 'error') {
      throw new PaymentCancelledException('상품 정보가 잘못됐습니다.!');
    }

    // Product 엔티티로 전환
    return resp.data.map((product) => {
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
      };
    });
  }
}
