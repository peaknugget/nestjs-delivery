import { Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('test')
  test() {
    console.log('🎈test');
    return { message: '✅ API 정상 작동 중입니다!' };
  }

  @Post('sample')
  createSamples() {
    console.log('🎈createSamples');
    return this.productService.createSamples();
  }
}
