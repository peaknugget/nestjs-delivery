import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '../entity/payment.entity';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  paymentName: string;

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

  @IsString()
  @IsNotEmpty()
  passwordTwoDigits: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

/**
 
{
	"productIds": ["8cc28226-076e-4472-8b08-4e5c2b51ebc5", "39a9fe98-091a-4dba-a314-195fea19f48c"],
	"address":{
		"name" : "홍길동",
		"street" :"도산데로 14",
		"city" : "서울",
		"postalCode": "123123",
		"country":"대한민국"
	},
	"payment":{
		"paymentMethod": "CreditCard",
		"paymentName":"법인카드",
		"cardNumber":"123123123123",
		"expiryYear":"26",
		"expiryMonth":"12",
		"birthOrRegistration" :"9",
		"passwordTwoDigits":"12",
		"amount":3000
		
		
	}
	
	
}
* 
 */
