# nestjs-prisma
学习如何在nestjs中使用prisma

### 准备工作

主要是`nestjs`脚手架安装以及数据库和`prisma`依赖安装

数据库用`mysql`,自行服务器搭建,不用docker

```typescript
//创建nest项目,修改端口为8500
nest new median

//安装prisma
pnpm install prisma -D

//初始化prisma
npx prisma init

//更改env文件里的链接为mysql链接,参考官网
//更改schema.prisma的provider为mysql
```

在`scheme.prisma`文件中新建`article-model`

```typescript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Article {
  id          Int      @id @default(autoincrement())
  title       String   @unique
  description String?
  body        String
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

执行`prisma`的迁移命令`migrate`

```typescript
npx prisma migrate dev --name 'init' 
```

完成以后就会在数据库里生成一张表`article`的表,同时生成`prisma/migrations`,包含具体的`SQL语句`

此时创建的是一个空白数据库,需要添加数据,创建种子文件

```typescript
touch prisma/seed.ts
```

内容如下

```typescript
//先安装依赖
pnpm install @prisma/client

//seed.ts
import { PrismaClient } from '@prisma/client';

//init prisma client
const prisma = new PrismaClient();

async function main() {
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma adds support for mongodb' },
    update: {},
    create: {
      title: 'prisma adds support for mongodb',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
    },
  });

  console.log({ post1, post2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

ts文件的执行需要使用`ts-node`

直接执行`ts-node prisma/seed.ts`即可把数据插入到`article`表中



### PrismaService

主要是用来抽象出客户端API,负责实例化`prismaClient`并连接到数据库实例



### 接口文档

主要是使用`swagger`

```typescript
pnpm install --save @nestjs/swagger swagger-ui-express
```

更新`main.ts`

```typescript
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

  await app.listen(3000);
}
bootstrap();
```

### CRUD

主要是熟悉`prisma`的语法 ,从官网以及掘金上看下,没有特别复杂



### 管道

这是之前一直忽略的点,一直不理解有啥用,现在明了主要是用来**校验参数和转换数据类型**

还是很重要的,流程如图

成功的请求:

![](https://cdn.jsdelivr.net/gh/ztao0916/image@main/img/202403091214450.png)

失败的请求:

![](https://cdn.jsdelivr.net/gh/ztao0916/image@main/img/202403091215235.png)

安装依赖包

```
pnpm install class-validator class-transformer
```

`class-validator` 包提供了用于验证输入数据的装饰器

`class-transformer` 包提供了用于将输入数据转换为所需形式的装饰器



然后在`main.ts`中全局引入管道校验,注意不是从以上的依赖包导入的,从`@nestjs/common`导入,新增内容如下

```
import { ValidationPipe } from '@nestjs/common';
...
app.useGlobalPipes(new ValidationPipe());
```

ok,下一步就可以验证了

既然是验证参数,那么肯定是验证`dto`文件夹的内容

校验`create-article.dto.ts`文件里的参数,更改后代码如下

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({ required: false })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  body: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  published?: boolean = false;
}
```

以上是`nestjs-pipe`参数校验功能



然后是需要执行 参数转换,在`articleController`中所有的文章`id`都应该传入`number`类型,需要做改动如下

```typescript
//main.ts新增如下
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
```

然后更新`articleController`,如图

![](https://cdn.jsdelivr.net/gh/ztao0916/image@main/img/202403102112257.png)

![](https://cdn.jsdelivr.net/gh/ztao0916/image@main/img/202403102113041.png)

上面几个需求的`id`都做了数据转换,最后验证的效果如图所示

![](https://cdn.jsdelivr.net/gh/ztao0916/image@main/img/202403102115067.png)

这样子的话就会很友好

