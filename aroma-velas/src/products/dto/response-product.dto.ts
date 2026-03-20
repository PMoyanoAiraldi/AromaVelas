import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

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
    categoryId!: string;

    @ApiProperty()
    state: boolean;
}