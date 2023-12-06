import {
  ClothingRepository,
  ElectronicRepository,
  FurnitureRepository,
  ProductsRepository,
} from './products.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ObjectId } from 'mongoose';
import slugify from 'slugify';

// Định nghĩa product factory
@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly clothingRepository: ClothingRepository,
    private readonly electronicRepository: ElectronicRepository,
    private readonly furnitureRepository: FurnitureRepository,
  ) {}

  static productRegistry: Map<string, any> = new Map(); // key-class

  // tạo hàm static để đăng ký type
  static registerProductType(type: string, classRef: any) {
    ProductsService.productRegistry.set(type, classRef);
  }

  // áp dụng Strategy Parttern
  async createProduct(type: string, payload: any) {
    try {
      const productClass = ProductsService.productRegistry.get(type);
      if (!productClass)
        throw new HttpException(
          `Invalid Product type: ${type}`,
          HttpStatus.BAD_REQUEST,
        );

      const relevantRepository = this.getRelevantRepository(type);
      const productInstance = new productClass(
        this.productsRepository,
        relevantRepository,
      );

      return productInstance.createProduct(payload);
    } catch (error) {
      throw error;
    }
  }
  // TODO: Fix
  private getRelevantRepository(type: string) {
    switch (type) {
      case 'Clothing':
        return this.clothingRepository;
      case 'Electronics':
        return this.electronicRepository;
      case 'Furniture':
        return this.furnitureRepository;
      default:
        throw new HttpException(
          `Invalid Product type: ${type}`,
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}

class Products {
  constructor(private readonly productRepository: ProductsRepository) {}
  // _id của product nhận theo Clothings, Electronics, Furniture
  async createProduct(createProductDto: CreateProductDto, shopId: ObjectId) {
    return await this.productRepository.create({
      ...createProductDto,
      slug: slugify(createProductDto.name.toLowerCase()),
      _id: shopId,
    });
  }
}

// Định nghĩa sub-class khác với product
class Clothings extends Products {
  constructor(
    productRepository: ProductsRepository,
    private readonly clothingRepository: ClothingRepository,
  ) {
    super(productRepository);
  }

  async createProduct(createProductDto: CreateProductDto) {
    const newClothing = await this.clothingRepository.create({
      ...createProductDto.attributes,
    });
    if (!newClothing)
      throw new HttpException(
        'Create new clothing error',
        HttpStatus.BAD_REQUEST,
      );

    const newProduct = await super.createProduct(
      {
        ...createProductDto,
        attributes: newClothing,
      },
      newClothing._id,
    );
    if (!newProduct)
      throw new HttpException('Create product error', HttpStatus.BAD_REQUEST);
    return newProduct;
  }
}

class Electronics extends Products {
  constructor(
    productRepository: ProductsRepository,
    private readonly electronicRepository: ElectronicRepository,
  ) {
    super(productRepository);
  }

  async createProduct(createProductDto: CreateProductDto) {
    const newElectronic = await this.electronicRepository.create({
      ...createProductDto.attributes,
    });
    if (!newElectronic)
      throw new HttpException(
        'Create new Electronic error',
        HttpStatus.BAD_REQUEST,
      );

    const newProduct = await super.createProduct(
      {
        ...createProductDto,
        attributes: newElectronic,
      },
      newElectronic._id,
    );
    if (!newProduct)
      throw new HttpException('Create product error', HttpStatus.BAD_REQUEST);
    return newProduct;
  }
}

class Furnitures extends Products {
  constructor(
    productRepository: ProductsRepository,
    private readonly furnitureRepository: FurnitureRepository,
  ) {
    super(productRepository);
  }

  async createProduct(createProductDto: CreateProductDto) {
    const newFurniture = await this.furnitureRepository.create({
      ...createProductDto.attributes,
    });
    if (!newFurniture)
      throw new HttpException(
        'Create new Furniture error',
        HttpStatus.BAD_REQUEST,
      );

    const newProduct = await super.createProduct(
      {
        ...createProductDto,
        attributes: newFurniture,
      },
      newFurniture._id,
    );
    if (!newProduct)
      throw new HttpException('Create product error', HttpStatus.BAD_REQUEST);
    return newProduct;
  }
}

ProductsService.registerProductType('Clothing', Clothings);
ProductsService.registerProductType('Electronics', Electronics);
ProductsService.registerProductType('Furnitures', Furnitures);
