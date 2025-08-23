import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '../entity/payment.entity';

export class MakePaymentDto {
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  @IsNotEmpty()
  paymentName: number;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  expiryYear: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @IsString()
  @IsNotEmpty()
  birthOrRegistration: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  userEmail: string;
}
