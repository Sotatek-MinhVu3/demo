import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './../database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './../mail/mail.module';
import Order from './../entities/order.entity';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from '../queue/email.consumer';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payment',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'payment-consumer',
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
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
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'email',
      },
    ),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Order]),
    DatabaseModule,
    MailModule,
  ],
  controllers: [OrderController],
  providers: [EmailConsumer, OrderService],
})
export class OrderModule {}
