import { OrderProduct } from "src/orderProduct/orderProduct.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'order'})

export class Order{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid', name: "userId", nullable: false })
    userId: string;
    
    
    @ManyToOne(() => User, (user) => user.order)
    user: User;

    @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.orders, { cascade: true })
    orderProducts: OrderProduct[];


    @Column({type: 'int'})
    total: number

    @Column({length: 90, nullable: false})
    address: string

    @Column({length: 90, nullable: false})
    city: string

    @Column({type: 'int'})
    postalCode: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true })
    transferReceipt: string;

    @Column({ type: 'timestamp', nullable: true })
    paymentDate: Date;
}