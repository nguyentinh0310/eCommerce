import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { CreateCartDto, UpdateCartDto } from './dto/cart.dto';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addToCart(@Body() cartDto: CreateCartDto) {
    const cart = await this.cartService.addToCart(cartDto)
    return {
      statusCode: HttpStatus.CREATED,
      message: "Add products to the cart successfully",
      metaData: cart
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateCart(@Body() cartDto: UpdateCartDto) {
    const cart = await this.cartService.updateCart(cartDto)
    return {
      statusCode: HttpStatus.OK,
      message: "Update Cart successfully",
      metaData: cart
    }
  }

  @Delete(':userId/:productId')
  @UseGuards(JwtAuthGuard)
  async removeProductFromCart(@Param('userId')  userId: string,@Param('productId')  productId: string) {
    const cart = await this.cartService.removeProductFromCart(userId, productId)
    return {
      statusCode: HttpStatus.OK,
      message: "Delete Cart successfully",
      metaData: cart
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getListCartUser(@Query() query: any) {
    const carts = await this.cartService.getListCartUser(query)
    return {
      statusCode: HttpStatus.OK,
      message: "Get list Cart successfully",
      metaData: carts
    }
  }
}
