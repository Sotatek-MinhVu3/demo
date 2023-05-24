import { IsEnum, IsNumber, IsString } from "class-validator";

enum Status {
    CREATED = 'created', 
    CONFIRMED = 'confirmed',
    CANCELED = 'canceled',
    DELIVERED = 'delivered'
  }

export class CreateOrderRequest {
    @IsNumber()
    userId: number;

    @IsNumber()
    price: number;

    @IsString()
    @IsEnum(Status)
    status: Status;

}