import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Payment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  public userId: number;

  @Column({
    type: 'int',
    name: 'order_id',
  })
  public orderId: number;

  @Column({
    type: 'int',
  })
  public price: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  public deletedAt: Date;
}

export default Payment;
