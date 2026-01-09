import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwtStrategy';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';


@Module({
    imports: [
        UsersModule, 
        PassportModule, 
        SharedModule, 
        AuthModule,
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        AuthService,
        UsersService,
        JwtStrategy, // Estrategia para autenticación JWT
    ],
    controllers: [AuthController],
})
export class AuthModule {}
