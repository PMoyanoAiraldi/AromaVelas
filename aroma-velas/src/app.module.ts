import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { postgresDataSourceConfig } from './config/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { OrderProduct } from './orderProduct/orderProduct.entity';
import { CategoryModule } from './category/category.module';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [ postgresDataSourceConfig]
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService): DataSourceOptions=>{
      const config = configService.get<DataSourceOptions>('postgres');
    if (!config) {
      throw new Error('Database configuration not found');
    }
    return config; // no es undefined
  }, 
    
  }),
  UsersModule,
  ProductsModule,
  OrderModule,
  OrderProduct,
  CategoryModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
