/*
 * @Author: ztao
 * @Date: 2024-03-04 09:05:33
 * @LastEditTime: 2024-03-06 11:53:58
 * @Description:
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8500);
  console.log('服务运行在8500端口');
}
bootstrap();
