import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { rolEnum } from 'src/users/users.entity';

interface JwtPayload {
  sub: string; // o number, según tu tipo de ID
  email?: string;
  name?: string;
  rol?: rolEnum
}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService, // Inyectamos el servicio de usuarios
  ) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token JWT del encabezado de autorización
      ignoreExpiration: false, // Verifica que el token no esté expirado
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'), // getOrThrow: Si JWT_SECRET no existe, la app NO INICIA
    });
  }

  // Este método se ejecuta si el token es válido
  async validate(payload: JwtPayload) {
    // Ahora TypeScript sabe que payload.sub existe y es string
    const userId = payload.sub;


    // Buscamos el usuario en la base de datos por su id
    const user = await this.usersService.getUserForId(userId); // Debes tener un método en tu servicio de usuarios que obtenga el usuario por su id

    // Si el usuario no existe, lanzamos una excepción
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Devolvemos el objeto completo del usuario para que esté disponible en req.user
    return user; // Aquí devolveremos el objeto completo de Usuario
  }
}

