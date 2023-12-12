import { CreateDiscountDto } from './create-discount-dto';
import { PartialType } from "@nestjs/swagger";

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
