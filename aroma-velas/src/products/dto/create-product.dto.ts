import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateProductDto {

    @ApiProperty({ description: "El nombre del producto" })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ description: "La descripción del producto" })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ 
        description: "El precio del producto", 
        example: 1000.50
    })
    @Transform(({ value } : { value: string }) => value ? parseFloat(value) : undefined)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number; 

    @ApiProperty({ 
        description: "URL de la imagen del producto", 
        required: false,
        example: "default-image-url.jpg"
    })
    @IsString()
    @IsOptional()
    img?: string;

    @ApiProperty({ description: 'Stock del producto', example: 100,})
    @Transform(({ value }: { value: unknown }) => { //Tipar value como unknown en vez de dejarlo any
    const num = typeof value === 'string' ? parseInt(value, 10) : value; //radix 10 al parseInt (buena práctica)
    return typeof num === 'number' && !isNaN(num) ? num : value; //Validar con !isNaN antes de retornar para evitar retornar NaN
    })
    @IsPositive({ message: 'El stock debe ser un número positivo.' })
    @IsNumber({}, { message: 'El stock debe ser un número válido.' })
    stock!: number;

    @ApiProperty({ description: "UUID de la categoría", example: "uuid-de-la-categoria" })
    @IsUUID()
    @IsNotEmpty()
    categoryId!: string

}
