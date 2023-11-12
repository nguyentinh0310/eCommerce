import { NestFactory } from '@nestjs/core';
import * as exitHook from 'async-exit-hook';
import * as compression from 'compression';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { env } from './config/environment';

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
