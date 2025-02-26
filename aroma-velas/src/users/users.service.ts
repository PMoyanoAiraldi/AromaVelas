import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {

constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
){}

    async createUser(createUserDto: CreateUserDto): Promise <User>{
        // Verificar si el correo ya existe
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new HttpException('El email ya está registrado', 400);
        }

        const newUser = new User();
        Object.assign(newUser, createUserDto);
        console.log('Usuario antes de guardar:', newUser);

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        newUser.password = hashedPassword;// Asignar la contraseña encriptada al nuevo usuario
        console.log('Hashed contrasena:', newUser.password);

        return this.userRepository.save(newUser)
        } catch (error) {
        console.error('Error al crear el usuario:', error);
        if (error instanceof HttpException) {
            throw error; // Re-lanzar excepciones controladas
        }
        throw new HttpException('Error al crear el usuario', 500);
    }
//async login(loginUserdto: LoginUserDto): Promise{

   // }

}
