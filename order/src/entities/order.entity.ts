import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Status {
  CREATED = 'created', 
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  DELIVERED = 'delivered'
}

@Entity()
class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  public userId: number;

  @Column({
    type: 'int',
  })
  public price: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED
  })
  public status: Status;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  public deletedAt: Date;
}

export default Order;
