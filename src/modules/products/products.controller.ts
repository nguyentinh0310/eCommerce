import { 
  Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Request, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'guard/jwt-auth.guard';
import { Types } from 'mongoose';
import { RequestWithUser } from 'types/auth.types';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Request() req: RequestWithUser, @Body() productDto: CreateProductDto) {
    return await this.productsService.createProduct(productDto.type, {
      ...productDto,
      shop: req.user._id,
    });
  }

  @Patch('edit/:producId')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Request() req: RequestWithUser, @Param('producId') producId: Types.ObjectId, @Body() productDto: UpdateProductDto) {
    return await this.productsService.updateProduct(productDto.type!, producId, {
      ...productDto,
      shop: req.user._id,
    });
  }

  @Get('publish/all')
  @UseGuards(JwtAuthGuard)
  async getAllPublishForShop(@Request() req: RequestWithUser) {
    return await this.productsService.findAllPublishForShop({
      shop: req.user._id,
    });
  }

  @Get('draft/all')
  @UseGuards(JwtAuthGuard)
  async getAllDraftForShop(@Request() req: RequestWithUser) {
    return await this.productsService.findAllDraftForShop({
      shop: req.user._id,
    });
  }

  @Patch('publish/:id')
  @UseGuards(JwtAuthGuard)
  async publishProductByShop(@Request() req: RequestWithUser, @Param('id') id: Types.ObjectId) {
    return await this.productsService.publishProductByShop({
      shopId: req.user._id,
      productId: id      
    });
  }

  @Patch('unpublish/:id')
  @UseGuards(JwtAuthGuard)
  async unPublishProductByShop(@Request() req: RequestWithUser, @Param('id') id: Types.ObjectId) {
    return await this.productsService.unPublishProductByShop({
      shopId: req.user._id,
      productId: id      
    });
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    return await this.productsService.searchProduct(query)
  }

  @Get()
  async findAllProduct(@Query() query: any) {
    return await this.productsService.findAllProduct(query)
  }

  @Get('/:id')
  async findProduct(@Param('id') id: Types.ObjectId) {
    return await this.productsService.findProduct({productId: id})
  }
}
