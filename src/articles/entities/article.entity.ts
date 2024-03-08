/*
 * @Author: ztao
 * @Date: 2024-03-06 12:00:50
 * @LastEditTime: 2024-03-08 17:18:23
 * @Description:
 */
import { Article } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleEntity implements Article {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  body: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
