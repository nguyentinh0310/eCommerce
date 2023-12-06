import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;
export type ClothingDocument = Clothing & Document;
export type ElectronicDocument = Electronic & Document;
export type FurnitureDocument = Furniture & Document;

@Schema({ collection: 'products' })
export class Product {
    @Prop({ required: true })
    name: string

    @Prop()
    slug: string

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    thumbnail: string

    @Prop({ required: true })
    price: number

    @Prop({ required: true })
    quantity: number

    @Prop({ type: [{ type: String, enum: ['Electronics', 'Clothing', 'Furniture'] }], required: true })
    type: string[]

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
    shop: MongooseSchema.Types.ObjectId

    @Prop({ type: MongooseSchema.Types.Mixed, required: true })
    attributes:  Record<string, any>;

    @Prop({ type: Number, default: 4.5, min: [1, 'Rating must be above 1.0'], max: [5, 'Rating must be below 5.0'], 
    set: (val: number) => Math.round(val * 10) / 10 })
    ratings: number;
  
    @Prop({ type: Array, default: [] })
    variations: any[];
  
    @Prop({ type: Boolean, default: true, index: true, select: false })
    isDraft: boolean | undefined;
  
    @Prop({ type: Boolean, default: false, index: true, select: false })
    isPublished: boolean;


    @Prop({ default: Date.now })
    createdAt: number;
  
    @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
    updatedAt: number;

    constructor(name: string, slug: string, description: string, thumbnail: string, price: number, quantity: number, type: string[], shop: MongooseSchema.Types.ObjectId, attributes: Record<string, any>, ratings: number, variations: any[], isDraft: boolean, isPublished: boolean, createdAt: number, updatedAt: number) {
        this.name = name
        this.slug = slug
        this.description = description
        this.thumbnail = thumbnail
        this.price = price
        this.quantity = quantity
        this.type = type
        this.shop = shop
        this.attributes = attributes
        this.ratings = ratings
        this.variations = variations
        this,isDraft = isDraft
        this.isPublished = isPublished
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

const ProductSchema = SchemaFactory.createForClass(Product);

export { ProductSchema };

// DB Clothing
@Schema({ collection: 'clothes' })
export class Clothing {
    @Prop({ required: true })
    brand: string

    @Prop()
    size: string

    @Prop()
    material: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'shop' })
    shop: MongooseSchema.Types.ObjectId

    @Prop({ default: Date.now })
    createdAt: number;
  
    @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
    updatedAt: number;

    constructor(brand: string, size: string, material: string, shop: MongooseSchema.Types.ObjectId, createdAt: number, updatedAt: number) {
        this.brand = brand
        this.size = size
        this.material = material
        this.shop = shop
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

// DB Electronic
@Schema({ collection: 'electronics' })
export class Electronic {
    @Prop({ required: true })
    manufacturer: string

    @Prop()
    model: string

    @Prop()
    color: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'shop' })
    shop: MongooseSchema.Types.ObjectId

    @Prop({ default: Date.now })
    createdAt: number;
  
    @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
    updatedAt: number;

    constructor(manufacturer: string, model: string, color: string, shop: MongooseSchema.Types.ObjectId, createdAt: number, updatedAt: number) {
        this.manufacturer = manufacturer
        this.model = model
        this.color = color
        this.shop = shop
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

// DB Furniture
@Schema({ collection: 'furnitures' })
export class Furniture {
    @Prop({ required: true })
    brand: string

    @Prop()
    size: string

    @Prop()
    material: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'shop' })
    shop: MongooseSchema.Types.ObjectId

    @Prop({ default: Date.now })
    createdAt: number;
  
    @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
    updatedAt: number;

    constructor(brand: string, size: string, material: string, shop: MongooseSchema.Types.ObjectId, createdAt: number, updatedAt: number) {
        this.brand = brand
        this.size = size
        this.material = material
        this.shop = shop
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}


const ClothingSchema = SchemaFactory.createForClass(Clothing);
const ElectronicSchema = SchemaFactory.createForClass(Electronic);
const FurnitureSchema = SchemaFactory.createForClass(Furniture);

export { ElectronicSchema, ClothingSchema, FurnitureSchema };