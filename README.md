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

