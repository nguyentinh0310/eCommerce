import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type KeyTokenDocument = KeyToken & Document;

@Schema({ collection: 'keys' })
export class KeyToken {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  publicKey: string;

  @Prop({ required: true })
  privateKey: string;

  @Prop({ type: [String], default: [] })
  refreshTokenUsed: string[];

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ default: Date.now })
  createdAt: number;

  @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
  updatedAt: number;

  constructor(
    user: MongooseSchema.Types.ObjectId,
    publicKey: string,
    privateKey: string,
    refreshTokenUsed: string[],
    refreshToken: string,
    createdAt: number,
    updatedAt: number,
  ) {
    this.user = user;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.refreshTokenUsed = refreshTokenUsed;
    this.refreshToken = refreshToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

const KeyTokenSchema = SchemaFactory.createForClass(KeyToken);

export { KeyTokenSchema };
