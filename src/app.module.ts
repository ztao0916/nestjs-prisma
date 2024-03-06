/*
 * @Author: ztao
 * @Date: 2024-03-04 09:05:33
 * @LastEditTime: 2024-03-06 12:00:40
 * @Description:
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [PrismaModule, ArticlesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
