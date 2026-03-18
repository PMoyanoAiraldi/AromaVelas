import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.entity";

export class ResponseUserDto {

    @ApiProperty({
    type: String,
    description: "ID del usuario",
    })
    id!: string;

    @ApiProperty({
        type: String,
        description: "El nombre del usuario",
        required: true,
    })
    name!: string;

    @ApiProperty({
        type: String,
        description: "La dirección del usuario",
        required: true,
    })
    address?: string;

    @ApiProperty({
        type: String,
        description: "La ciudad del usuario",
        required: true,
    })
    city?: string;

    @ApiProperty({
        type: String,
        description: "El país del usuario",
        required: true,
    })
    country?: string;

    @ApiProperty({
        type: String,
        description: "El número de teléfono del usuario",
        required: true,
    })
    phone?: string;

    @ApiProperty({
        type: String,
        description: "El correo electrónico del usuario",
        required: true,
    })
    email!: string;

    @ApiProperty({
    type: String,
    description: "Rol del usuario",
    })
    rol!: string;

    constructor(user: Partial<User>) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.address = user.address;
        this.phone = user.phone;
        this.country = user.country;
        this.city = user.city;
        this.rol = user.rol;
}

}


