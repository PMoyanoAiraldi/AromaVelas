import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Aroma Velas")
    .setDescription("Esta aplicación permite a los usuarios registrarse, consultar y acceder a una variedad de productos ofrecidos por Aroma velas")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
