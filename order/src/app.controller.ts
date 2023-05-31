import { Body, Controller, Delete, Get, Param, Post, Put , Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderRequest } from './create-order-request.dto';
import { UpdateOrderRequest } from './update-order-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createOrder(@Body() createOrderRequest: CreateOrderRequest) {
    return await this.appService.createOrder(createOrderRequest);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    return await this.appService.deleteOrder(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: number, @Body() updateOrderRequest: UpdateOrderRequest, @Query() query: any) {
    console.log(`query: `, query);
    return await this.appService.updateOrder(id, updateOrderRequest);
  }

  @Get(':id')
  async getOrder(@Param('id') id: number) {
    return await this.appService.getOrderById(id);
  }

}
