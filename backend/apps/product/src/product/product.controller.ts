import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetProductsInfo } from './dto/get-products-info.dto';
import { RpcInterceptor } from '@app/common/interceptor';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'create_samples' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  createSamples() {
    console.log('🎈product microservice Controller  createSamples');
    return this.productService.createSamples();
  }

  @MessagePattern({ cmd: 'get_products_info' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  getProductsInfo(@Payload() data: GetProductsInfo) {
    console.log('🎈getProductsInfo');
    return this.productService.getProductsInfo(data.productIds);
  }
}
