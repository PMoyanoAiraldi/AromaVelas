import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Products } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError,  Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { CategoryService } from 'src/category/category.service';
import { CloudinaryService } from 'src/file-upload/cloudinary.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly categoryService: CategoryService,
        private readonly cloudinaryService: CloudinaryService
    ){}

    async createProduct(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<ResponseProductDto> {
        try {
            console.log('Datos del DTO recibidos:', createProductDto);
            
            const normalizedName = createProductDto.name.trim().toUpperCase();
    
            const productExist = await this.productsRepository
                .createQueryBuilder('product')
                .where('UPPER(product.name) = :name', { name: normalizedName })
                .getOne();
    
            if (productExist) {
                throw new HttpException(
                    `El producto con el nombre "${createProductDto.name}" ya existe.`,
                    HttpStatus.BAD_REQUEST,
                );
            }
    
            const category = await this.categoryService.findOne(createProductDto.categoryId);
            if (!category) {
                throw new NotFoundException(`Categoria con ID ${createProductDto.categoryId} no encontrada`);
            }
            console.log('Categoria encontrada:', category);

          // Subir la imagen si existe un archivo
            let imageUrl: string | undefined;
            if (file) {
                try {
                    // Espera la carga de la imagen
                    imageUrl = await this.cloudinaryService.uploadFile(file.buffer, 'product', file.originalname);
                    console.log('Archivo subido a Cloudinary:', imageUrl);
                } catch (error) {
                    console.error('Error al subir la imagen a Cloudinary:', error);
                    throw new InternalServerErrorException('Error al subir la imagen');
                }
            }

            const newProduct = this.productsRepository.create({
                name: normalizedName,
                description: createProductDto.description,
                category: { id: category.id },             
                img: imageUrl ?? createProductDto.img ?? 'default-image-url.jpg',
                stock: createProductDto.stock,
                price: createProductDto.price,
            });

            // Guardar la clase y esperar su confirmación
            const savedProduct = await this.productsRepository.save(newProduct);
            console.log("Producto guardado", savedProduct)
    
            // Cargar las relaciones para el response
        const productWithRelations = await this.productsRepository.findOne({
            where: { id: savedProduct.id },
            relations: ['category']
        });

            return ResponseProductDto.fromEntity(productWithRelations);
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new HttpException(
                    'Ya existe un producto con ese nombre.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw error;
        }
    }

}