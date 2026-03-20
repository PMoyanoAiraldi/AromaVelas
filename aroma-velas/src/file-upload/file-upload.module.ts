import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CloudinaryService } from './cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Products } from 'src/products/products.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Products]),
  
  ],
  providers: [FileUploadService,UsersService, CloudinaryService],
  controllers: [],
  exports: [FileUploadService,  CloudinaryService]
})

export class FileUploadModule {}
