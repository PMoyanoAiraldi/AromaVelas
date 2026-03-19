import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

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


            
}