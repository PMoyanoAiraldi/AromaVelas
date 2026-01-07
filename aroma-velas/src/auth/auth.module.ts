import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwtStrategy';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.entity';


@Module({
    imports: [
        UsersModule, 
        PassportModule, 
        SharedModule, 
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        AuthService,
        JwtStrategy, // Estrategia para autenticación JWT
    ],
    controllers: [AuthController],
})
export class AuthModule {}
