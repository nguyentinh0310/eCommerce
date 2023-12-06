import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'guard/jwt-auth.guard';
import { RequestWithUser } from 'types/auth.types';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createProduct(@Request() req: RequestWithUser,@Body() productDto: CreateProductDto) {
    return this.productsService.createProduct(
      productDto.type,{
        ...productDto,
        shop: req.user._id
      }
    );
  }
}
