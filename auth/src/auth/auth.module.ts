import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from './../database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../entities/user.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
