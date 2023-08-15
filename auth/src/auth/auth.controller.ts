import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import { MessagePattern } from '@nestjs/microservices';
import { GetUserRequest } from '../dtos/get-user-request.dto';
import { AuthService } from './auth.service';
import { CreateUserRequest } from 'src/dtos/create-user-request.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @MessagePattern('get_user')
  @Get()
  getUser(@Body() getUserRequest: GetUserRequest) {
    return this.authService.getUser(getUserRequest);
  }

  @Post('create')
  createUser(@Body() req: CreateUserRequest) {
    return this.authService.createUser(req);
  }
}
