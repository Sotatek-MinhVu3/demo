import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetUserRequest } from '../dtos/get-user-request.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('get_user')
  getUser(getUserRequest: GetUserRequest) {
    return this.authService.getUser(getUserRequest);
  }
}
