import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './libs/filters';
import { ResponseInterceptor } from './libs/interceptors';
import { ValidationPipe } from './libs/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Hmm')
    .setDescription('흠')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
        description: '액세스 토큰을 입력 해주세요',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
        description: '리프레시 토큰을 입력 해주세요',
      },
      'refresh-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const options = {
    useGlobalPrefix: true,
    customSiteTitle: 'Hmm Server API Docs',
  };
  SwaggerModule.setup('docs', app, document, options);
  app.use(cookieParser());
  app.use(morgan('common'));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.listen(parseInt(configService.get<string>('PORT'), 10), '0.0.0.0');
}
bootstrap();
