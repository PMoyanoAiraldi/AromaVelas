import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from 'src/products/products.entity';



@Injectable()
export class FileUploadService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(Products) 
        private readonly productsRepository: Repository<Products>,
    ){}

    async uploadFile(
        file: Express.Multer.File, 
        entityType: 'product',
        entityId?: string
    ): Promise<{ imgUrl: string }>{
    
        if (!file || !file.buffer || !file.originalname) {
            throw new Error('El archivo proporcionado no es válido');
        }

        // Determinamos la carpeta según el tipo de entidad
        const folder = this.getFolderForEntityType(entityType);
        console.log(`Folder generado para ${entityType}: ${folder}`);


        const url = await this.cloudinaryService.uploadFile(
            file.buffer,
            folder,
            file.originalname
        );
        console.log(`Archivo subido a ${url}`);

        // Actualizar la URL de la imagen en la entidad correspondiente usando los servicios
        switch (entityType) {
            case 'product':{
                if (!entityId) {
                    throw new BadRequestException('No se proporcionó un ID del producto');
                }

                //  Actualizar directamente en el repositorio
                const product = await this.productsRepository.findOne({ 
                    where: { id: entityId } 
                });

            if (!product) {
                throw new NotFoundException('Producto no encontrado');;
            }
            
           // Eliminar la imagen anterior si existe
                if (product.img && product.img !== 'default-image-url.jpg') {
                    try {
                        await this.cloudinaryService.deleteFile(product.img);
                    } catch (error) {
                        console.error('Error al eliminar imagen anterior:', error);
                    }
                }

                // Actualizar solo la URL de la imagen
                product.img = url;
                await this.productsRepository.save(product);
                console.log("Imagen del producto actualizada", product);
                break;
            }
        default:
            throw new Error('Tipo de entidad no compatible');
        }
        //await this.productsRepository.updateProduct(productId, {imgUrl: url});
        return {imgUrl: url}
    }

    // Función para eliminar un archivo
    async deleteFile(publicId: string): Promise<void> {
        try {
            await this.cloudinaryService.deleteFile(publicId);  // Utilizando el servicio de Cloudinary
        } catch (error) {
            console.error('Error:', error instanceof Error ? error.message : error);
            throw new InternalServerErrorException('Error al eliminar el archivo de Cloudinary');
        }
    }

    private getFolderForEntityType(entityType: string): string {
        switch (entityType) {
            case 'product':
                return 'product';
            default:
                throw new BadRequestException('Tipo de entidad no compatible');
        }
    }
}
