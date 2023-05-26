import { NotFoundException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './create-order-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './order-created.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Order from './order.entity';
import { UpdateOrderRequest } from './update-order-request.dto';
import { GetUserRequest } from './get-user-request.dto';
import { OrderDeletedEvent } from './order-deleted.event';
import { OrderUpdatedEvent } from './order-updated.event';

enum Status {
  CREATED = 'created', 
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  DELIVERED = 'delivered'
}

@Injectable()
export class AppService {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientKafka,

    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientKafka,

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
    
    this.authClient
      .send('get_user', new GetUserRequest(createOrderDto.userId))
      .subscribe(async (user) => {
          console.log(
            `Payment of user with stripe ID ${user?.stripeId} with email ${user?.email} a price of ${createOrderDto.price}`
          );
        if(user?.id === createOrderDto.userId) {
          const newOrder = this.orderRepository.create(createOrderDto);
          this.paymentClient.emit('order_created', new OrderCreatedEvent(newOrder.id, newOrder.userId, newOrder.price, newOrder.status));
          const orderCreated = await this.orderRepository.save(newOrder);
          return {
            message: 'Success!'
          }
        }
        return {
          message: 'Failed!'
        }
        
      });
    
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
    this.paymentClient.emit('order_updated', new OrderUpdatedEvent(id, updateOrderDto.userId, updateOrderDto.price, updateOrderDto.status));
    return {
      message: 'Updated successfully!'
    }
  }

  async deleteOrder(id: number) {
    const order = await this.getOrderById(id);
    if(!order) {
      throw new NotFoundException({
        message: 'Order not found',
      });
    }
    this.paymentClient.emit('order_deleted', new OrderDeletedEvent(id, order.userId, order.price, Status.CANCELED));
    await this.orderRepository.softDelete(id);
  }
  
  getHello(): string {
    return 'Hello World!';
  }
}
