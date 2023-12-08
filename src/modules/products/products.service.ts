import { updateNestedObjectParser } from './../../utils/common';
import {
  ClothingRepository,
  ElectronicRepository,
  FurnitureRepository,
  IProductShop,
  ProductsRepository,
} from './products.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ObjectId, Types } from 'mongoose';
import slugify from 'slugify';
import { UpdateProductDto } from './dto/update-product.dto';
import { removeUnderfinedObject } from '@utils/common';

// Áp dụng Factory Parttern cho ProductsService
@Injectable()
export class ProductsService {
  private readonly repositories: Record<string, any>;
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly clothingRepository: ClothingRepository,
    private readonly electronicRepository: ElectronicRepository,
    private readonly furnitureRepository: FurnitureRepository,
  ) {
    // Khởi tạo đối tượng repositories với các repository tương ứng
    this.repositories = {
      Clothing: this.clothingRepository,
      Electronics: this.electronicRepository,
      Furniture: this.furnitureRepository,
    };
  }

  static productRegistry: Map<string, any> = new Map(); // key-class

  // Phương thức static để đăng ký loại sản phẩm và lớp tương ứng
  static registerProductType(type: string, classRef: any) {
    ProductsService.productRegistry.set(type, classRef);
  }

  // Áp dụng Strategy Parttern
  async createProduct(type: string, payload: any) {
    try {
      const productClass = ProductsService.productRegistry.get(type);
      if (!productClass)
        throw new HttpException(
          `Invalid Product type: ${type}`,
          HttpStatus.BAD_REQUEST,
        );

      const productInstance = new productClass(
        this.productsRepository,
        this.repositories[type],
      );

      return productInstance.createProduct(payload);
    } catch (error) {
      throw error;
    }
  }

  // Áp dụng Strategy Parttern
  async updateProduct(type: string, producId: Types.ObjectId, payload: any) {
    try {
      const productClass = ProductsService.productRegistry.get(type);
      if (!productClass)
        throw new HttpException(
          `Invalid Product type: ${type}`,
          HttpStatus.BAD_REQUEST,
        );

      const productInstance = new productClass(
        this.productsRepository,
        this.repositories[type],
      );

      return productInstance.updateProduct(producId, payload);
    } catch (error) {
      throw error;
    }
  }

  async findAllPublishForShop({ shop, limit = 50, skip = 0 }: any) {
    const query = { shop, isPublished: true };
    return await this.productsRepository.findAllPublish({ query, limit, skip });
  }

  async findAllDraftForShop({ shop, limit = 50, skip = 0 }: any) {
    const query = { shop, isDraft: true };
    return await this.productsRepository.findAllDraft({ query, limit, skip });
  }

  async publishProductByShop({ shopId, productId }: IProductShop) {
    return await this.productsRepository.publishProduct({
      shopId,
      productId,
    });
  }

  async unPublishProductByShop({ shopId, productId }: IProductShop) {
    return await this.productsRepository.unPublishProduct({
      shopId,
      productId,
    });
  }

  async searchProduct(query: string) {
    return await this.productsRepository.searchProduct(query);
  }

  async findAllProduct({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    const products = await this.productsRepository.findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: ['name', 'description', 'price', 'quantity', 'thumbnail'],
    });

    const totalRows = await this.productsRepository.count();
    return {
      products,
      pagination: {
        page,
        limit,
        totalRows,
      },
    };
  }

  async findProduct({ productId }: { productId: Types.ObjectId }) {
    return await this.productsRepository.findProduct({
      productId,
      unSelect: ['__v'],
    });
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

  async updateProduct(
    productId: ObjectId,
    updadteProductDto: UpdateProductDto,
  ) {
    const { name } = updadteProductDto;
    return await this.productRepository.findByIdAndUpdate(productId, {
      ...updadteProductDto,
      slug: slugify(name!.toLowerCase()),
    });
  }
}

// Định nghĩa sub-class
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

  async updateProduct(productId: ObjectId, productDto: UpdateProductDto) {
    // Xóa attribute giá trị là null, underfined
    const objectParams = removeUnderfinedObject(productDto);
    // update class con Clothing
    if (objectParams.attributes) {
      await this.clothingRepository.findByIdAndUpdate(
        productId,
        updateNestedObjectParser(objectParams.attributes),
      );
    }

    // update cả product
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
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
ProductsService.registerProductType('Furniture', Furnitures);
