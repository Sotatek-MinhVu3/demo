import { NotFoundException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './create-order-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './order-created.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Order from './order.entity';
import { UpdateOrderRequest } from './update-order-request.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientKafka,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrderById(id: number) {
    const order = await this.orderRepository.findOneById(id);
    if (!order) {
      return null;
    }
    return order;
  }

  async createOrder(createOrderDto: CreateOrderRequest) {
    const newOrder = this.orderRepository.create(createOrderDto);
    this.paymentClient.emit('order_created', new OrderCreatedEvent(newOrder.id, newOrder.userId, newOrder.price, newOrder.status));
    await this.orderRepository.save(newOrder);
    return {
      message: 'Success'
    }
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderRequest) {
    const order = await this.orderRepository.findOne({
      where: {
        id: id,
        userId: updateOrderDto.userId
      }
    });
    if(!order) {
      throw new NotFoundException({
        message: 'Order not found',
      });
    }
    const updateOrder = await this.orderRepository.update(id, updateOrderDto);
    return {
      message: 'Update success',
    }
  }

  async deleteOrder(id: number) {
    const order = this.getOrderById(id);
    if(!order) {
      throw new NotFoundException({
        message: 'Order not found',
      });
    }
    await this.orderRepository.softDelete(id);
  }
  
  getHello(): string {
    return 'Hello World!';
  }
}
