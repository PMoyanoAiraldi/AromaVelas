import { ApiProperty } from "@nestjs/swagger";
import { ResponseProductDto } from "src/products/dto/response-product.dto";

export class ResponseCategoryDto {
    
    

    @ApiProperty({
        type: String,
        description: "El nombre de la categoria",
        required: true,
    })
    name: string;


    @ApiProperty({
        type: [ResponseProductDto],
        description: "El nombre de la categoria",
        required: true,
    })
    products: ResponseProductDto[];

}