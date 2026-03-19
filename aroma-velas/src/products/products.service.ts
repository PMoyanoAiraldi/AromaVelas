import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Products } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly categoryService: CategoryService
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
    
            const category = await this.categoryService.findOne(createProductDto.lineaId);
            if (!linea) {
                throw new NotFoundException(`Linea con ID ${createProductDto.lineaId} no encontrada`);
            }
            console.log('Linea encontrada:', linea);

            if (createProductDto.marcaId) {
            const marca = await this.marcaService.findOne(createProductDto.marcaId);
            if (!marca) {
                throw new NotFoundException(`Marca con ID ${createProductDto.marcaId} no encontrada`);
            }
            console.log('Marca encontrada:', marca);
        }

            if (createProductDto.rubroId) {
            const rubro = await this.rubroService.findOneRubro(createProductDto.rubroId);
            if (!rubro) {
                throw new NotFoundException(`Rubro con ID ${createProductDto.rubroId} no encontrado`);
            }
            console.log('Rubro encontrado:', rubro);
        }

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

              // Crear el producto sin el precio
            const newProduct = this.productsRepository.create({
                nombre: normalizedName,
                descripcion: createProductDto.descripcion,
                codigo: createProductDto.codigo,
                codigoAlternativo1: createProductDto.codigoAlternativo1,
                codigoAlternativo2: createProductDto.codigoAlternativo2,
                marca: { id: createProductDto.marcaId }, 
                linea: createProductDto.lineaId ? { id: createProductDto.lineaId } : undefined, 
                rubro: { id: createProductDto.rubroId }, 
                //subRubro: createProductDto.subrubroId ? { id: createProductDto.subrubroId } : undefined, 
                imgUrl: imageUrl || createProductDto.imgUrl || 'default-image-url.jpg',
                //precios: precio ? [precio] : [] // Asociar el precio si existe
            });

            // Guardar la clase y esperar su confirmación
            const savedProduct = await this.productsRepository.save(newProduct);
            console.log("Producto guardado", savedProduct)
    
            //Validamos y obtenemos el precio si se proporciona
            if (createProductDto.precio) {
                const precio = this.precioRepository.create({
                producto: savedProduct, // Asociar con el producto recién creado
                precio: createProductDto.precio,
                listaPrecio: createProductDto.listaPrecio || 1 // Lista 1 por defecto
            });
            await this.precioRepository.save(precio);
            console.log('Precio guardado:', precio);
            }
    
            // Cargar las relaciones para el response
        const productWithRelations = await this.productsRepository.findOne({
            where: { id: savedProduct.id },
            relations: ['marca', 'linea', 'rubro', 'precios']
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