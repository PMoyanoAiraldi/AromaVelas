import { Order } from "src/order/order.entity";
import { Products } from "src/products/products.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'orderProduct'})

export class OrderProduct{
    
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'uuid', name: "productId", nullable: false })
    productId!: string;
        
    @ManyToOne(() => Products, (product) => product.orderProduct,)
    @JoinColumn({ name: "productId" })
    product!: Products;

    @Column({type: 'int'})
    quantity!: number

    @Column({type: 'int'})
    subtotal!: number

    @Column({ type: 'uuid', name: 'orderId', nullable: false })
    orderId!: string

    @ManyToOne(() => Order, (orders) => orders.orderProducts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    orders!: Order;

}