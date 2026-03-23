import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Products } from 'src/products/products.entity';
import { ResponseProductDto } from 'src/products/dto/response-product.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';

@Injectable()
export class CategoryService {
constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ){}

    async createCategroy(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try{
            // Normalizar el nombre a minúsculas
        const normalizedName = createCategoryDto.name.trim().toLowerCase();
    
        // Verificar si existe una categoria con el mismo nombre normalizado
        const existingCategory = await this.categoryRepository
        .createQueryBuilder('category')
        .where('LOWER(category.name) = :name', { name: normalizedName })
        .getOne();
    
        if (existingCategory) {
            // Lanza un error si ya existe una categoria con ese nombre
            throw new HttpException(`La categoria "${createCategoryDto.name}" ya existe.`, HttpStatus.BAD_REQUEST);
        }   
        
        // Si no existe, crea y guarda la nueva categoria
        const category = this.categoryRepository.create({
            name: createCategoryDto.name.trim() // Guardar el nombre normalizado
        });
    
        console.log("Categoria antes de ser guardada", category)
    
            return await this.categoryRepository.save(category);
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                // Error de unicidad detectado (código específico de PostgreSQL)
                throw new HttpException(
                    'Ya existe una category con ese nombre.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            // Si el error no es de unicidad, lánzalo tal como está
            throw error;
        }
            }

    // Obtener todas para admin
    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    // Obtener solo activas (para público)
    async findAllActive(): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { state: true },
            order: { name: 'ASC' }
        });
    } 
    
    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
            if (!category) {
                throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
        }
            return category;
        }

    async findOneActiv(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
            if (!category.state) {
                throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
            }
                return category;
            }

    async updateState(id: string, state: boolean): Promise<Category> {
        const category = await this.findOne(id);
        category.state = state;
        return this.categoryRepository.save(category);
    }   

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
            if (!category) {
                throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
            } 
        
        // Si no se proporciona ningún dato válido, lanzar un error
            if (!updateCategoryDto.name) {
                throw new BadRequestException('No se proporcionaron datos para actualizar la categoria.');
            }
                
        // Verificar si el nombre ya existe en otra categoria
            if (updateCategoryDto.name) {
                const normalizedName = updateCategoryDto.name.trim().toLowerCase();// Normaliza a minúsculas
        
            const existingCategory = await this.categoryRepository.findOne({
                where: { name: normalizedName},
            });
                if (existingCategory && existingCategory.id !== id) {
                    throw new BadRequestException(`El nombre de la categoria "${updateCategoryDto.name}" ya existe`);
            }
        
        // Verificar si el nombre propuesto es igual al actual al normalizarlo
        if (category.name.toLowerCase() === normalizedName) {
                    throw new BadRequestException(`El nombre de la categroia "${updateCategoryDto.name}" ya existe`);
            }
        
        // Asignar el nombre normalizado
        category.name = updateCategoryDto.name.trim();
        }
                        
        try {
            return await this.categoryRepository.save(category);
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new HttpException(
                'Ya existe una categoria con ese nombre.',
                    HttpStatus.BAD_REQUEST,
            );
            }
                throw error;
            }
        }
        
        private toProductResponseDto(product: Products): ResponseProductDto {
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                img: product.img || 'default-image-url.jpg',
                state: product.state,
                price: product.price,
                stock: product.stock,
                category: {
                    id: product.category?.id,
                    name: product.category?.name,}
            };
        }

    async findProductByCategory(categoryId: string): Promise <ResponseCategoryDto> {
            const category = await this.categoryRepository.findOne({
                    where: { id: categoryId },
                    relations: ['products'],
            });
        
            if (!category || !category.state) {
                throw new HttpException("Categoria no encontrada", HttpStatus.NOT_FOUND);
            }
        
            // Filtra los productos activos
            const productActives = category.products
            .filter(product => product.state)
            .map(product => this.toProductResponseDto(product)) //función que convierte entidades en DTO
        
            // Devuelve la información de la marca activa con sus productos activos
            return {
                name: category.name, 
                products: productActives
            };
        
            }

            
}