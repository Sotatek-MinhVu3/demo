import { Injectable } from '@nestjs/common';
import { GetUserRequest } from './../dtos/get-user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) {}

  async getUser(getUserRequest: GetUserRequest) {
    const res: User =  await this.authRepository.findOneById(getUserRequest.userId);
    if(!res) {
      return null;
    } 
    console.log({
      stripeId: res.stripeId,
      email: res.email
    });
    return JSON.stringify(res);
  }
}
