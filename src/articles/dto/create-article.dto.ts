/*
 * @Author: ztao
 * @Date: 2024-03-06 12:00:50
 * @LastEditTime: 2024-03-08 16:50:43
 * @Description:
 */
import { ApiProperty } from '@nestjs/swagger';
export class CreateArticleDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty({ required: false, default: false })
  published?: boolean = false;
}
