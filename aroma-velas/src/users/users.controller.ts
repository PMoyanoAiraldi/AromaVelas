import { Body, Controller, Post} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';

@ApiTags("User")
@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

@Post('register')
@ApiOperation({ summary: 'Crear un nuevo usuario' })
@ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: CreateUserDto })
@ApiResponse({ status: 500, description: 'Error inesperado al crear el usuario' })
    
    async createUser(@Body() createUser: CreateUserDto) {
        const user = await this.usersService.createUser(createUser)

        return {
            message: `Usuario creado exitosamente`,
            user
        };
    }
}