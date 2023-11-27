import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type ApiKeyDocument = ApiKey & Document

@Schema({ collection: 'api-keys' })
export class ApiKey {
    @Prop({ unique: true })
    key: string;

    @Prop({ default: true })
    status: boolean;

    @Prop({ type: [{ type: String, enum: ['0000', '1111', '2222'] }] })
    permissions: string[];

    @Prop({ default: Date.now })
    createdAt: number;
  
    @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
    updatedAt: number;
  
    constructor(key:string, status: boolean, permissions: [], createdAt: number, updatedAt: number,){
      this.key= key
      this.status = status
      this.permissions = permissions
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
}

const ApiKeySchema = SchemaFactory.createForClass(ApiKey)

export { ApiKeySchema }