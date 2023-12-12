import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RequestWithUser } from 'types/auth.types';
import { CreateDiscountDto } from './dto/create-discount-dto';
import { Types } from 'mongoose';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDiscountCode(@Request() req: RequestWithUser, @Body() discountDto: any) {
    const discountCode = await this.discountService.createDiscountCode({
      ...discountDto,
      shopId: req.user._id,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: "Create discount code successfully",
      meta: discountCode
    }
  }

  @Patch('/:discountId')
  @UseGuards(JwtAuthGuard)
  async updateDiscountCode(@Request() req: RequestWithUser, @Param('discountId') discountId: Types.ObjectId, @Body() discountDto: UpdateDiscountDto) {
    const discountCode = await this.discountService.updateDiscountCode(discountId, {
      ...discountDto,
      shopId: req.user._id,
    });
    return {
      statusCode: HttpStatus.OK,
      message: "Update discount code successfully",
      meta: discountCode
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDiscountCodes(@Query() query: any) {
    const discountCodes = await this.discountService.getAllDiscountCodes(query)
    return {
      statusCode: HttpStatus.OK,
      message: "Get all discount code successfully",
      meta: discountCodes
    }
  }

  @Get("/shop")
  @UseGuards(JwtAuthGuard)
  async getAllDiscountCodeByShop(@Query() query: any) {
    const discountCodes = await this.discountService.getAllDiscountCodeByShop(query)
    return {
      statusCode: HttpStatus.OK,
      message: "Get all discount code successfully",
      meta: discountCodes
    }
  }

  @Post("/amount")
  @UseGuards(JwtAuthGuard)
  async getDiscountAmount(@Body() payload: any) {
    const discount = await this.discountService.getDiscountAmount(payload)
    return {
      statusCode: HttpStatus.OK,
      message: "Get all discount amount successfully",
      meta: discount
    }
  }

  @Delete(':shopId/:code')
  @UseGuards(JwtAuthGuard)
  async deleteDiscountCode(@Param('shopId') shopId: string, @Param('code') code: string,) {
    const deletedDiscount = await this.discountService.deleteDiscountCode({ shopId, code });
    return {
      statusCode: HttpStatus.OK,
      message: "Delete discount code successfully",
      meta: deletedDiscount
    }
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelDiscountCode(@Body() payload: any) {
    const deletedDiscount = await this.discountService.cancelDiscountCode(payload);
    return {
      statusCode: HttpStatus.OK,
      message: "Update discount code successfully",
      meta: deletedDiscount
    }
  }
}
