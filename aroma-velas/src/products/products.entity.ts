import { Category } from "src/category/category.entity";
import { OrderProduct } from "src/orderProduct/orderProduct.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products'})
export class Products{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({length: 100, unique: true})
    description: string

    @Column({type: 'int'})
    price: number

    @Column({ nullable: true})
    img: string

    @Column({type: 'int'})
    stock: number

    @Column({ type: 'uuid', name: "categoryId", nullable: false })
    categoryId: string;


    @ManyToOne(() => Category, (category) => category.products,)
    @JoinColumn({ name: "categoryId" })
    category: Category;

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
    orderProduct: OrderProduct[]
}