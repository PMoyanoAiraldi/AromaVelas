import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";

export enum rolEnum {
    ADMIN = 'admin',
    CLIENTE = 'cliente',
}

@Entity({
    name: 'users'
})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 80, nullable: false })
    name: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: number;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({
        type: 'enum',
        enum: rolEnum,
        default: rolEnum.CLIENTE,
    })
    rol: rolEnum;


    @Column({ default: true }) // Por defecto, el usuario estará activo
    state: boolean;
}
