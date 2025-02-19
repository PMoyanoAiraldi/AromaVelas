import { Products } from "src/products/products.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'order'})

export class Order{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid', name: "productId", nullable: false })
    productId: string;
    
    
    @ManyToOne(() => Products, (product) => product.order,)
    @JoinColumn({ name: "productId" })
    product: Products;

    @Column({type: 'int'})
    quantity: number

    @Column({type: 'int'})
    total: number
}