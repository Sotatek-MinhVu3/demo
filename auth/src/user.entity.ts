import { Column, Entity, Generated, PrimaryColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryColumn()
    id: number;

    @Column({
        name: 'stripe_id',
    })
    stripeId: string;

    @Column()
    email: string;
}