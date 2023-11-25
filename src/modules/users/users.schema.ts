import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  name: string;

  @Prop({ enum: ['active', 'inactive'], default: 'inactive' })
  status: string;

  @Prop({ default: false })
  verify: boolean;

  @Prop({ default: [], type: Array })
  roles: [];

  constructor(email:string, password:string, name: string, status: string, verify: boolean, roles: []){
    this.email= email
    this.password = password
    this.name = name
    this.status = status
    this.verify = verify
    this.roles = roles
  }
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
