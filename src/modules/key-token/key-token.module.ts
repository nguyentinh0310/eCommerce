import { Module } from '@nestjs/common';
import { KeyTokenService } from './key-token.service';
import { KeyTokenController } from './key-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyToken, KeyTokenSchema } from './key-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KeyToken.name, schema: KeyTokenSchema },
    ]),
  ],
  controllers: [KeyTokenController],
  providers: [KeyTokenService],
})
export class KeyTokenModule {}
