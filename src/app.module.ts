import { ApiKeyModule } from '@modules/api-key/api-key.module';
import { AuthModule } from '@modules/auth/auth.module';
import { KeyTokenModule } from '@modules/key-token/key-token.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyAuthGuard } from 'guard/api-key.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from './config/environment';

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
