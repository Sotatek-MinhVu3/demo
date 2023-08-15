import { Injectable } from '@nestjs/common';
import { GetUserRequest } from './../dtos/get-user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entities/user.entity';
import { CreateUserRequest } from 'src/dtos/create-user-request.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) {}

  async getUser(getUserRequest: GetUserRequest) {
    const res = this.authRepository
                        .createQueryBuilder('user')
                        .where("user.id = :id", {id: getUserRequest.userId});  
    // console.log(res);
    this._transform(res);
  }

  async createUser(req: CreateUserRequest) {
    const res = this.authRepository
                      .createQueryBuilder('user')
                      .insert()
                      .into(User)
                      .values([
                        { id: req.userId, stripeId: req.stripeId, email: req.email }
                      ]);
    this._transform(res);
  }

  private _transform(res: any) {
    let [sql, params] = res.getQueryAndParameters();
    params.forEach((value, i) => {
      const index = '$' + ( i + 1)
      if (typeof value === 'string') {
        sql = sql.replace(index, `"${value}"`);
      }
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          sql = sql.replace(
            index,
            value.map((element) => (typeof element === 'string' ? `"${element}"` : element)).join(','),
          );
        } else {
          sql = sql.replace(index, value);
        }
      }
      if (['number', 'boolean'].includes(typeof value)) {
        sql = sql.replace(index, value.toString());
      }
    }); 
    console.log(sql);
  }
}
