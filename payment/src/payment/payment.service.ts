import { Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from './../events/order-created.event';
import { OrderUpdatedEvent } from './../events/order-updated.event';
import { InjectRepository } from '@nestjs/typeorm';
import Payment from './../entities/payment.entity';
import { Repository } from 'typeorm';
import { UpdatePaymentRequest } from './../dtos/update-payment-request.dto';
import { OrderDeletedEvent } from './../events/order-deleted.event';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}


  async handleOrderDeleted(orderDeletedEvent: OrderDeletedEvent) {
    console.log({
      orderStatus: orderDeletedEvent.status,
      orderId: orderDeletedEvent.orderId,
      userId: orderDeletedEvent.userId,
      price: orderDeletedEvent.price
    });
  }

  handleOrderCreated(orderCreatedEvent: OrderCreatedEvent) {
    console.log({
      orderId: orderCreatedEvent.orderId,
      userId: orderCreatedEvent.userId,
      price: orderCreatedEvent.price
    });
  }

  handleOrderUpdated(orderUpdatedEvent: OrderUpdatedEvent) {
    if(orderUpdatedEvent.status === 'confirmed') {
      const paymentUpdateDto = new UpdatePaymentRequest(orderUpdatedEvent.orderId, orderUpdatedEvent.userId, orderUpdatedEvent.price);
      this.paymentRepository.save(paymentUpdateDto);
    }
    console.log({
      orderStatus: orderUpdatedEvent.status,
      orderId: orderUpdatedEvent.orderId,
      userId: orderUpdatedEvent.userId,
      price: orderUpdatedEvent.price
    });
  }

}
