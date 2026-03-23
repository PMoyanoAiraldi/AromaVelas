import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Products } from './products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { CategoryService } from 'src/category/category.service';
import { CloudinaryService } from 'src/file-upload/cloudinary.service';


@Module({
    imports: [TypeOrmModule.forFeature([Products, Category])],
    controllers: [ProductsController],
    providers: [ProductsService, CategoryService, CloudinaryService],
})
export class ProductsModule {}