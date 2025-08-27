import { IsNotEmpty, IsString } from 'class-validator';

export class UserPayloadDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsString()
  type: string;

  @IsString()
  iat: string;

  @IsString()
  exp: string;
}
