/*
 * @Author: ztao
 * @Date: 2024-03-05 17:53:26
 * @LastEditTime: 2024-03-06 16:46:15
 * @Description:prisma-service
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
