import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('Inventory')
export class InventoryController {
  constructor(private readonly InventoryService: InventoryService) {}
}
