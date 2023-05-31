import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { OrderCreatedEvent } from './../events/order-created.event';
import { OrderUpdatedEvent } from './../events/order-updated.event';
import { OrderDeletedEvent } from './../events/order-deleted.event';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @EventPattern('order_created')
  handleOrderCreated(orderCreatedEvent: OrderCreatedEvent) {
    this.paymentService.handleOrderCreated(orderCreatedEvent);
  }

  @EventPattern('order_updated')
  handleOrderUpdated(orderUpdatedEvent: OrderUpdatedEvent) {
    this.paymentService.handleOrderUpdated(orderUpdatedEvent);
  }

  @EventPattern('order_deleted')
  handleOrderDeleted(orderDeletedEvent: OrderDeletedEvent) {
    this.paymentService.handleOrderDeleted(orderDeletedEvent);
  }

}
