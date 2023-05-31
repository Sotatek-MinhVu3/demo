import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderRequest } from './dtos/create-order-request.dto';
import { UpdateOrderRequest } from './dtos/update-order-request.dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  async createOrder(@Body() createOrderRequest: CreateOrderRequest) {
    return await this.appService.createOrder(createOrderRequest);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    return await this.appService.deleteOrder(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: number, @Body() updateOrderRequest: UpdateOrderRequest) {
    return await this.appService.updateOrder(id, updateOrderRequest);
  }

  @Get(':id')
  async getOrder(@Param('id') id: number) {
    return await this.appService.getOrderById(id);
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user');
    await this.authClient.connect();
  }

}
