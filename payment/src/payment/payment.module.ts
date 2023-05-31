import { Module } from '@nestjs/common';
import { DatabaseModule } from './../database/database.module';
import Payment from './../entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: 
  [
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
    TypeOrmModule.forFeature([Payment]),
    DatabaseModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
