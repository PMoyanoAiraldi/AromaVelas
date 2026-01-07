import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor (
        private readonly authService: AuthService,

    ) {}

    @Post('signup')
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: CreateUserDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al crear el usuario' })
        
        async createUser(@Body() createUser: CreateUserDto) {
            const user = await this.authService.signup(createUser)

            return {
                message: `Usuario creado exitosamente`,
                user
            };
        }

}
