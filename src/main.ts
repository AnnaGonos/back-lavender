import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import methodOverride from 'method-override';
import * as dotenv from 'dotenv';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { JwtAuthRedirectFilter } from './auth/exceptions/jwt-auth-redirect.filter';
import { config } from 'dotenv';

config();
async function bootstrap() {
  dotenv.config({ path: join(__dirname, '..', '.env') });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.use(methodOverride('_method'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  app.useGlobalFilters(new JwtAuthRedirectFilter());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Florist API')
    .setDescription('API documentation for Florist application')
    .setVersion('1.0')
    .addTag('categories', 'Работа с категориями')
    .addTag('cart', 'Корзина')
    .addTag('favorites', 'Операции с избранными товарами')
    .addTag('reviews', 'Отзывы')
    .addTag('products', 'Товары')
    .addTag('orders', 'Работа с заказами')
    .addTag('profile', 'Личный кабинет')
    .addTag('auth', 'Авторизация')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
  console.log(`GraphQL playground is available at: http://localhost:${port}/graphql`);
}

bootstrap();
