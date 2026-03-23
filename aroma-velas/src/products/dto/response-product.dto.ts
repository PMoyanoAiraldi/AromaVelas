import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Products } from "../products.entity";

export class ResponseProductDto {

    @ApiProperty()
    @Expose()
    id!: string;

    @ApiProperty()
    @Expose()
    name!: string;

    @ApiProperty()
    @Expose()
    description!: string;

    @ApiProperty()
    @Expose()
    price!: number;

    @ApiProperty()
    @Expose()
    img?: string;

    @ApiProperty()
    @Expose()
    stock!: number;

    @ApiProperty()
    @Expose()
    category!: { id: string; name: string };

    @ApiProperty()
    state: boolean;

    static fromEntity(product: Products): ResponseProductDto {
        const dto = new ResponseProductDto();
        dto.id = product.id;
        dto.name = product.name;
        dto.description = product.description;
        dto.price = product.price;
        dto.stock = product.stock;
        dto.img = product.img;
        dto.category = { id: product.category.id, name: product.category.name };
        return dto;
    }
}