import { Injectable } from '@nestjs/common';
import { GetUserRequest } from './get-user-request.dto';

@Injectable()
export class AppService {

  private readonly users: any[] = [
    {
      userId: '123',
      stripeUserId: '43234'
    },
    {
      userId: '456',
      stripeUserId: '78987'
    }
  ];

  getUser(getUserRequest: GetUserRequest) {
    const res =  this.users.find((user) => user.userId === getUserRequest.userId);
    if(!res) {
      return null;
    } 
    return res;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
