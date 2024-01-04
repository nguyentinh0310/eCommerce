export class InventoryDto {
  constructor(productId: string, location: string, stock: number, shopId: string, reservations: any[]) {
    this.productId = productId;
    this.location = location;
    this.stock = stock;
    this.shopId = shopId;
    this.reservations = reservations;
  }
  productId: string
  
  location?: string
  
  stock: number
  
  shopId: string
  
  reservations?: any[]
}
