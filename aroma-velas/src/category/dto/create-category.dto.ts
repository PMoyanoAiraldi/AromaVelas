import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {

    @ApiProperty({ description: "El nombre de la categoria" })
    @IsString()
    @IsNotEmpty()
    name!: string;

}