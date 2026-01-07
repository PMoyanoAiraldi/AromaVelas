import { ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from "@nestjs/jwt";
import { User } from 'src/users/users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
) {}

async signup(createUserDto: CreateUserDto): Promise <Partial<User>>{
        try{
    // Verificar si el correo ya existe
        const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email.toLowerCase() } });
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        const newUser = new User();
        Object.assign(newUser, createUserDto);

        console.log('Usuario antes de guardar:', newUser);

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        newUser.password = hashedPassword;// Asignar la contraseña encriptada al nuevo usuario
        newUser.email = createUserDto.email.toLowerCase(); //Normalizamos el email

        console.log('Hashed contraseña:', newUser.password);

        const savedUser = await this.usersRepository.save(newUser);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;

        } catch (error) {
        console.error('Error al crear el usuario:', error);
        
        if (error instanceof HttpException) {
            throw error; // Re-lanzar excepciones controladas
        }
        
        throw new HttpException(
            'Error al crear el usuario', 
            HttpStatus.INTERNAL_SERVER_ERROR
        );
        }
    }

    async signin(loginUser: LoginUserDto): Promise<{ usuario: Partial<User>, token: string }> {
        try{
        const user = await this.usersRepository.findOne({ 
            where: {email: loginUser.email.toLowerCase()},
        });
        console.log('Email recibido en el login:', loginUser.email);
        console.log('Usuario encontrado:', user);


        if (!user) {
            throw new UnauthorizedException('Email o contraseña incorrecto');
        }
    
        // Verificar si el usuario está habilitado
        if (!user.state) {
            throw new ForbiddenException('Tu cuenta está suspendida. Contacta al administrador.');
        }

        const isPasswordValid = await bcrypt.compare(loginUser.password, user.password);

        console.log('Contraseña recibida en el login:', loginUser.password);
        console.log('Contraseña coincide:', isPasswordValid);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email o contraseña incorrectos');
        }

        const token = await this.createToken(user);
        
        
        // Elimina campos sensibles como contrasena
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        // Devuelve tanto el token como la información del usuario
        return {
            usuario: userWithoutPassword,
            token
        };
        } catch (error) {
        console.error('Error en el login:', error);
        
        if (error instanceof HttpException) {
            throw error;
        }
        
        throw new HttpException(
            'Error al iniciar sesión', 
            HttpStatus.INTERNAL_SERVER_ERROR
        );
        }
    }

    private async createToken(usuario: User): Promise<string> {
        const payload = {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        };
        return await this.jwtService.signAsync(payload)
    }

}
