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
    const product = await this.productsService.createProduct(productDto.type, {
      ...productDto,
      shop: req.user._id,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: "Create product successfully",
      meta: product
    }
  }

  @Patch('edit/:producId')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Request() req: RequestWithUser, @Param('producId') producId: Types.ObjectId, @Body() productDto: UpdateProductDto) {
    const product = await this.productsService.updateProduct(productDto.type!, producId, {
      ...productDto,
      shop: req.user._id,
    });
    return {
      statusCode: HttpStatus.OK,
      message: "Update product successfully",
      meta: product
    }
  }

  @Get('publish/all')
  @UseGuards(JwtAuthGuard)
  async getAllPublishForShop(@Request() req: RequestWithUser) {
    const products = await this.productsService.findAllPublishForShop({
      shop: req.user._id,
    });

    return {
      statusCode: HttpStatus.OK,
      message: "Get All product publish successfully",
      meta: products
    }
  }

  @Get('draft/all')
  @UseGuards(JwtAuthGuard)
  async getAllDraftForShop(@Request() req: RequestWithUser) {
    const products = await this.productsService.findAllDraftForShop({
      shop: req.user._id,
    });

    return {
      statusCode: HttpStatus.OK,
      message: "Get All product daft successfully",
      meta: products
    }
  }

  @Patch('publish/:id')
  @UseGuards(JwtAuthGuard)
  async publishProductByShop(@Request() req: RequestWithUser, @Param('id') id: Types.ObjectId) {
    const product = await this.productsService.publishProductByShop({
      shopId: req.user._id,
      productId: id      
    });

    return {
      statusCode: HttpStatus.OK,
      message: "Publish product successfully",
      meta: product
    }
  }

  @Patch('unpublish/:id')
  @UseGuards(JwtAuthGuard)
  async unPublishProductByShop(@Request() req: RequestWithUser, @Param('id') id: Types.ObjectId) {
    const product =  await this.productsService.unPublishProductByShop({
      shopId: req.user._id,
      productId: id      
    });

    return {
      statusCode: HttpStatus.OK,
      message: "Unpublish product successfully",
      meta: product
    }
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    const products = await this.productsService.searchProduct(query)
    return {
      statusCode: HttpStatus.OK,
      message: "Search products successfully",
      meta: products
    }
  }

  @Get()
  async findAllProduct(@Query() query: any) {
    const products = await this.productsService.findAllProduct(query)
    return {
      statusCode: HttpStatus.OK,
      message: "Get all products successfully",
      meta: products
    }
  }

  @Get('/:id')
  async findProduct(@Param('id') id: Types.ObjectId) {
    const product = await this.productsService.findProduct({productId: id})
    return {
      statusCode: HttpStatus.OK,
      message: "Get detail product successfully",
      meta: product
    }
  }
}
