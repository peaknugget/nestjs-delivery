import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  async createOrder(token: string, body: any): Promise<any> {
    /// 1) 사용자 정보 가져오기
    /// 2) 주문 생성하기
    /// 3) 총 금액 계산하기
    /// 4) 금액 검증하기 - total 이 맞는지 (프론트에서 보내준 데이터량)
    /// 5) 주문 생성하기 - 데이터베이스에 넣기
    ////6) 결제 시도하기
    /// 7) 주문 상태 업데이트하기
    /// 8) 결과 반환하기
  }
}
