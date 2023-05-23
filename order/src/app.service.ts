import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './create-order-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './order-created.event';

@Injectable()
export class AppService {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientKafka,
  ) {}

  createOrder({ userId, price }: CreateOrderRequest) {
    this.paymentClient.emit('order_created', new OrderCreatedEvent('123', userId, price));
  }
  getHello(): string {
    return 'Hello World!';
  }
}
