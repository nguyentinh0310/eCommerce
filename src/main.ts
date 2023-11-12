import { NestFactory } from '@nestjs/core';
import * as exitHook from 'async-exit-hook';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { env } from './config/environment';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const hostname = 'localhost' || env.APP_HOST;
  const port = env.APP_PORT;
  const app = await NestFactory.create(AppModule);

  // morgan middleware để ghi log
  app.use(morgan('dev'));
  // helmet middleware để bảo mật ứng dụng
  app.use(helmet());
  // compression middleware để nén gửi dữ liệu
  app.use(compression());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('ECommerce API')
    .setDescription('The ECommerce API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'defaultBearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://${hostname}:${port}/`);
  });

  // Thực hiện tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('Disconnection from MongoDB Cloud Atlas');
  });
}

(async () => {
  try {
    await bootstrap();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();
