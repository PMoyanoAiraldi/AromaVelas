import { Products } from "src/products/products.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'category'})
export class Category{
    
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ length: 80, nullable: false})
    name!: string

    @OneToMany(() => Products, (products) => products.category)
    products!: Products[]

    @Column({default: true})
    state!: boolean
}