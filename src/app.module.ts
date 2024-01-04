import { env } from './config/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiKeyModule } from '@modules/api-key/api-key.module';
import { AuthModule } from '@modules/auth/auth.module';
import { KeyTokenModule } from '@modules/key-token/key-token.module';
import { UsersModule } from '@modules/users/users.module';
import { ProductsModule } from '@modules/products/products.module';
import { DiscountModule } from '@modules/discount/discount.module';
import { CartModule } from '@modules/cart/cart.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyAuthGuard } from '@guard/api-key.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(env.MONGODB_URI, {
      // options
      dbName: env.DATABASE_NAME,
    }),
    UsersModule,
    KeyTokenModule,
    ApiKeyModule,
    AuthModule,
    ProductsModule,
    DiscountModule,
    CartModule,
    InventoryModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ApiKeyAuthGuard,
    // },
  ],
})
export class AppModule {}
