import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { CreateOrderRequest } from './../dtos/create-order-request.dto';
import { UpdateOrderRequest } from './../dtos/update-order-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller('/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,

    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientKafka,
  ) {}

  @Post('create')
  async createOrder(@Body() createOrderRequest: CreateOrderRequest) {
    return await this.orderService.createOrder(createOrderRequest);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    return await this.orderService.deleteOrder(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: number, @Body() updateOrderRequest: UpdateOrderRequest) {
    return await this.orderService.updateOrder(id, updateOrderRequest);
  }

  @Get(':id')
  async getOrder(@Param('id') id: number) {
    return await this.orderService.getOrderById(id);
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user');
    await this.authClient.connect();
  }

}
