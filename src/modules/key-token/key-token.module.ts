import { Module } from '@nestjs/common';
import { KeyTokenService } from './key-token.service';
import { KeyTokenController } from './key-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyToken, KeyTokenSchema } from './key-token.schema';
import { KeyTokenRepository } from './key-token.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KeyToken.name, schema: KeyTokenSchema },
    ]),
  ],
  controllers: [KeyTokenController],
  providers: [KeyTokenService, KeyTokenRepository],
  exports: [KeyTokenService],
})
export class KeyTokenModule {}
