import { Injectable } from '@nestjs/common';
import { InventoryDto } from './dto/inventory.dto';
import { InventoryRepository } from './inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async insertInventory(payload: InventoryDto) {
    console.log(
      '🚀 ~ InventoryRepository ~ insertInventory ~ payload:',
      payload,
    );
    return await this.inventoryRepository.create({
      ...payload,
      location: 'unkown',
    });
  }
}
