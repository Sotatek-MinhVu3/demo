import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderUpdatedEvent } from './events/order-updated.event';
import { OrderDeletedEvent } from './events/order-deleted.event';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,

    // @Inject('AUTH_SERVICE')
    // private readonly authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('order_created')
  handleOrderCreated(orderCreatedEvent: OrderCreatedEvent) {
    this.appService.handleOrderCreated(orderCreatedEvent);
  }

  @EventPattern('order_updated')
  handleOrderUpdated(orderUpdatedEvent: OrderUpdatedEvent) {
    this.appService.handleOrderUpdated(orderUpdatedEvent);
  }

  @EventPattern('order_deleted')
  handleOrderDeleted(orderDeletedEvent: OrderDeletedEvent) {
    this.appService.handleOrderDeleted(orderDeletedEvent);
  }

  onModuleInit() {
    // this.authClient.subscribeToResponseOf('get_user');
  }
}
