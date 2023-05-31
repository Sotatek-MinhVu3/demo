import { NotFoundException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dtos/create-order-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './events/order-created.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Order from './entities/order.entity';
import { UpdateOrderRequest } from './dtos/update-order-request.dto';
import { GetUserRequest } from './dtos/get-user-request.dto';
import { OrderDeletedEvent } from './events/order-deleted.event';
import { OrderUpdatedEvent } from './events/order-updated.event';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeleteOrderRequest } from './dtos/delete-order-request.dto';

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

    @InjectQueue('email')
        private queue: Queue,

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
          if(!user) {
            console.log('User not found'); 
            return;          
          }
          const newOrder = this.orderRepository.create(createOrderDto);
          this.paymentClient.emit('order_created', new OrderCreatedEvent(newOrder.id, newOrder.userId, newOrder.price, newOrder.status));
          const orderCreated = await this.orderRepository.save(newOrder);
          await this.queue.add('send-email', {
            email: user?.email,
            stripeId: user?.stripeId,
            price: createOrderDto.price,
            status: Status.CREATED,
            time: new Date().toJSON().slice(0,19).replace('T',' '),
          });
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
    this.authClient
      .send('get_user', new GetUserRequest(updateOrderDto.userId))
      .subscribe(async (user) => {
        const updateOrder = await this.orderRepository.update(id, updateOrderDto);
        this.paymentClient.emit('order_updated', new OrderUpdatedEvent(id, updateOrderDto.userId, updateOrderDto.price, updateOrderDto.status));
        await this.queue.add('send-email', {
          email: user?.email,
          stripeId: user?.stripeId,
          price: updateOrderDto.price,
          status: updateOrderDto.status,
          time: new Date().toJSON().slice(0,19).replace('T',' '),
        });
      });
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
    this.authClient
      .send('get_user', new GetUserRequest(order.userId))
      .subscribe(async (user) => {
        await this.orderRepository.update(id, new DeleteOrderRequest(Status.CANCELED));
        this.paymentClient.emit('order_deleted', new OrderDeletedEvent(id, order.userId, order.price, Status.CANCELED));
        await this.orderRepository.softDelete(id);
        await this.queue.add('send-email', {
          email: user?.email,
          stripeId: user?.stripeId,
          price: order.price,
          status: Status.CANCELED,
          time: new Date().toJSON().slice(0,19).replace('T',' '),
        });
      });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const createdNumber = await this.orderRepository.count({
      where: {
        status: Status.CREATED,
      }
    });

    const confirmedNumber = await this.orderRepository.count({
      where: {
        status: Status.CONFIRMED,
      }
    });

    const deliveredNumber = await this.orderRepository.count({
      where: {
        status: Status.DELIVERED,
      }
    });

    const canceledNumber = await this.orderRepository.count({
      where: {
        status: Status.CANCELED,
      }, withDeleted: true,
    });
    console.log({
      created: createdNumber,
      confirmed: confirmedNumber,
      delivered: deliveredNumber,
      canceled: canceledNumber
    });

  }
  
  getHello(): string {
    return 'Hello World!';
  }
}
