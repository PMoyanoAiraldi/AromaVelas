import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor global para class-transformer (@Expose, @Exclude)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ValidationPipe global para class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // elimina campos que no están en el DTO
    forbidNonWhitelisted: true, // lanza error si llegan campos extra
    transform: true,           // transforma automáticamente los tipos
  }));


  const swaggerConfig = new DocumentBuilder()
    .setTitle("Aroma Velas")
    .setDescription("Esta aplicación permite a los usuarios registrarse, consultar y acceder a una variedad de productos ofrecidos por Aroma velas")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);


  await app.listen(parseInt(process.env.PORT ?? '3000', 10)); //es buena práctica parsear el port
}
bootstrap();
