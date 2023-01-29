import * as path from 'path';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards';
import { CachesModule } from './caches/caches.module';
import { AuthMiddleware } from './libs/middlewares';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
          signOptions: {
            expiresIn: parseInt(configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN')),
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mariadb',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT'), 10),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [path.join(__dirname, configService.get<string>('DB_ENTITIES'))],
          logging: configService.get<string>('DB_LOGGING') === 'true',
          synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        };
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: configService.get<string>('CACHE_HOST'),
            port: parseInt(configService.get<string>('CACHE_PORT'), 10),
          },
        };
      },
    }),
    AuthModule,
    MembersModule,
    CachesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/auth/login/naver', method: RequestMethod.GET },
        { path: 'api/auth/token/refresh', method: RequestMethod.GET },
      )
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });
  }
}
